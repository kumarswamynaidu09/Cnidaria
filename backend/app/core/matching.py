import asyncio
import logging
from typing import List, Optional, Tuple
import numpy as np
import httpx

from app.schemas.search import SearchCandidate
from app.core.face import decode_image_bytes, detect_and_encode_face

logger = logging.getLogger(__name__)

MAX_CANDIDATE_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB
DOWNLOAD_TIMEOUT_SECONDS = 10.0
MAX_CONCURRENT_MATCHES = 3


def compute_cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """
    Computes cosine similarity between two 512-dimensional ArcFace feature vectors.
    Range: -1.0 to 1.0 (higher = stronger feature alignment).
    """
    norm_a = float(np.linalg.norm(vec_a))
    norm_b = float(np.linalg.norm(vec_b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    dot_product = float(np.dot(vec_a, vec_b))
    cosine_sim = dot_product / (norm_a * norm_b)
    return max(-1.0, min(1.0, cosine_sim))


def classify_match_score(score_pct: float) -> str:
    """
    Classifies visual similarity percentage into visual match tiers.
    Note: These thresholds are visual/embedding similarity indicators for demo attribution
    and are not legally binding identity verification proofs.
    """
    if score_pct >= 90.0:
        return "Strong visual match"
    elif score_pct >= 80.0:
        return "Likely visual match"
    elif score_pct >= 70.0:
        return "Possible visual match"
    else:
        return "Weak visual match"


class CandidateMatcher:
    def __init__(self):
        self._semaphore = asyncio.Semaphore(MAX_CONCURRENT_MATCHES)

    async def download_candidate_bytes(self, url: str) -> Tuple[Optional[bytes], str]:
        """
        Downloads a candidate image in memory with stream size checks and timeouts.
        Returns: Tuple[image_bytes, status_code_or_error_reason]
        """
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        try:
            async with httpx.AsyncClient(timeout=DOWNLOAD_TIMEOUT_SECONDS, follow_redirects=True, headers=headers) as client:
                async with client.stream("GET", url) as response:
                    if response.status_code != 200:
                        return None, "image_unavailable"

                    content_length = response.headers.get("Content-Length")
                    if content_length and int(content_length) > MAX_CANDIDATE_IMAGE_BYTES:
                        return None, "image_too_large"

                    body_bytes = bytearray()
                    async for chunk in response.aiter_bytes():
                        body_bytes.extend(chunk)
                        if len(body_bytes) > MAX_CANDIDATE_IMAGE_BYTES:
                            return None, "image_too_large"

                    return bytes(body_bytes), "ok"
        except httpx.TimeoutException:
            logger.warning(f"Timeout downloading candidate image from {url}")
            return None, "image_unavailable"
        except Exception as err:
            logger.warning(f"Failed candidate image download from {url}: {err}")
            return None, "image_unavailable"

    async def evaluate_candidate(
        self, candidate: SearchCandidate, target_embedding: np.ndarray
    ) -> SearchCandidate:
        """
        Evaluates a single candidate: downloads image, runs face detection,
        extracts ArcFace embedding, and computes cosine similarity against target_embedding.
        """
        async with self._semaphore:
            target_url = candidate.image_url or candidate.thumbnail_url
            if not target_url:
                candidate.face_status = "image_unavailable"
                return candidate

            # Step 1: Download candidate image
            image_bytes, dl_status = await self.download_candidate_bytes(target_url)

            # Fallback to thumbnail URL if main image URL failed
            if dl_status != "ok" and candidate.thumbnail_url and candidate.thumbnail_url != target_url:
                image_bytes, dl_status = await self.download_candidate_bytes(candidate.thumbnail_url)

            if dl_status != "ok" or not image_bytes:
                candidate.face_status = dl_status
                return candidate

            # Step 2: Decode image in memory
            img = decode_image_bytes(image_bytes)
            if img is None:
                candidate.face_status = "invalid_image"
                return candidate

            # Step 3: Run face detection & landmark extraction using existing InsightFace model
            try:
                face_count, face_details, error_msg = detect_and_encode_face(img)
            except Exception as err:
                logger.error(f"Error evaluating candidate face {candidate.id}: {err}")
                candidate.face_status = "processing_error"
                return candidate

            if face_count == 0:
                candidate.face_status = "no_face"
                return candidate

            if face_count > 1:
                candidate.face_status = "multiple_faces"
                return candidate

            # Step 4: Single face detected - compute ArcFace cosine similarity
            candidate_embedding = face_details["embedding"]
            raw_cosine = compute_cosine_similarity(target_embedding, candidate_embedding)

            # Convert cosine similarity (-1.0 to 1.0) into visual match percentage (0.0 to 100.0)
            score_pct = round(max(0.0, float(raw_cosine)) * 100.0, 1)
            raw_sim = round(max(0.0, float(raw_cosine)), 4)

            candidate.face_status = "matched"
            candidate.similarity = raw_sim
            candidate.similarityScore = score_pct
            candidate.match_classification = classify_match_score(score_pct)

            logger.info(
                f"Candidate {candidate.id} ({candidate.source}): ArcFace Cosine={raw_cosine:.4f} -> {score_pct}% ({candidate.match_classification})"
            )
            return candidate

    async def match_and_rank_candidates(
        self, candidates: List[SearchCandidate], target_embedding: np.ndarray
    ) -> List[SearchCandidate]:
        """
        Evaluates all candidates concurrently and ranks them by descending visual similarity score.
        """
        if not candidates:
            return []

        tasks = [self.evaluate_candidate(cand, target_embedding) for cand in candidates]
        evaluated_candidates = await asyncio.gather(*tasks, return_exceptions=False)

        # Separate candidates with successfully calculated similarity score from unmatchable candidates
        matched = [c for c in evaluated_candidates if c.face_status == "matched"]
        unmatched = [c for c in evaluated_candidates if c.face_status != "matched"]

        # Sort matched candidates by similarity score descending
        matched.sort(key=lambda c: c.similarityScore if c.similarityScore is not None else -1.0, reverse=True)

        return matched + unmatched


# Global candidate matcher instance
candidate_matcher = CandidateMatcher()

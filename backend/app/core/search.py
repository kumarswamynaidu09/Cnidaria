import os
import uuid
import tempfile
import logging
import urllib.parse
from abc import ABC, abstractmethod
from typing import List, Tuple, Optional

from PicImageSearch import GoogleLens, Yandex, Bing, BaiDu
from app.schemas.search import SearchCandidate

logger = logging.getLogger(__name__)


def extract_domain(url: Optional[str]) -> Optional[str]:
    if not url:
        return None
    try:
        parsed = urllib.parse.urlparse(url)
        netloc = parsed.netloc or parsed.path.split('/')[0]
        return netloc.replace("www.", "") if netloc else None
    except Exception:
        return None


def classify_source_type(url: Optional[str], domain: Optional[str]) -> str:
    combined = ((url or "") + " " + (domain or "")).lower()
    if any(s in combined for s in ["instagram.com", "facebook.com", "x.com", "twitter.com", "linkedin.com", "tiktok.com", "pinterest.com", "reddit.com"]):
        return "social_media"
    if any(s in combined for s in ["youtube.com", "vimeo.com", "dailymotion.com"]):
        return "video"
    if any(s in combined for s in ["reuters.com", "apnews.com", "bloomberg.com", "bbc.com", "techcrunch.com", "nytimes.com", "cnn.com", "news"]):
        return "news"
    if any(s in combined for s in ["arxiv.org", "scholar.google.com", "sciencedirect.com", "ieee.org", "cern"]):
        return "academic"
    return "web"


class VisualSearchProvider(ABC):
    @abstractmethod
    async def search(self, image_bytes: bytes, filename: str = "image.jpg") -> Tuple[str, List[SearchCandidate]]:
        """
        Executes a reverse-image search.
        Returns: Tuple[provider_name, candidates_list]
        """
        pass


class PicImageSearchProvider(VisualSearchProvider):
    def __init__(self):
        self.google_lens = GoogleLens()
        self.yandex = Yandex()
        self.bing = Bing()
        self.baidu = BaiDu()

    async def search(self, image_bytes: bytes, filename: str = "image.jpg") -> Tuple[str, List[SearchCandidate]]:
        # Create temporary image file for PicImageSearch engines
        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        tmp_path = tmp_file.name
        try:
            tmp_file.write(image_bytes)
            tmp_file.flush()
            tmp_file.close()

            # 1. Attempt Google Lens
            try:
                logger.info("Querying Google Lens via PicImageSearch...")
                res = await self.google_lens.search(file=tmp_path)
                candidates = self._parse_google_lens_response(res)
                if candidates:
                    logger.info(f"Google Lens search returned {len(candidates)} real candidates.")
                    return "picimagesearch:google_lens", candidates
            except Exception as e:
                logger.warning(f"Google Lens engine failed or blocked: {e}")

            # 2. Attempt Yandex
            try:
                logger.info("Querying Yandex via PicImageSearch...")
                res = await self.yandex.search(file=tmp_path)
                candidates = self._parse_yandex_response(res)
                if candidates:
                    logger.info(f"Yandex search returned {len(candidates)} real candidates.")
                    return "picimagesearch:yandex", candidates
            except Exception as e:
                logger.warning(f"Yandex engine failed or blocked: {e}")

            # 3. Attempt Bing
            try:
                logger.info("Querying Bing via PicImageSearch...")
                res = await self.bing.search(file=tmp_path)
                candidates = self._parse_bing_response(res)
                if candidates:
                    logger.info(f"Bing search returned {len(candidates)} real candidates.")
                    return "picimagesearch:bing", candidates
            except Exception as e:
                logger.warning(f"Bing engine failed or blocked: {e}")

            # 4. Attempt BaiDu
            try:
                logger.info("Querying BaiDu via PicImageSearch...")
                res = await self.baidu.search(file=tmp_path)
                candidates = self._parse_baidu_response(res)
                if candidates:
                    logger.info(f"BaiDu search returned {len(candidates)} real candidates.")
                    return "picimagesearch:baidu", candidates
            except Exception as e:
                logger.warning(f"BaiDu engine failed or blocked: {e}")

            logger.error("All reverse image search providers failed or returned 0 candidates.")
            return "picimagesearch:none", []

        finally:
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except Exception as cleanup_err:
                    logger.warning(f"Failed to remove temporary image file '{tmp_path}': {cleanup_err}")

    def _deduplicate_and_limit(self, candidates: List[SearchCandidate], limit: int = 30) -> List[SearchCandidate]:
        seen_keys = set()
        deduped = []
        for cand in candidates:
            # Level 1 URL normalization deduplication
            url_key = cand.url or ""
            img_key = cand.image_url or cand.thumbnail_url or ""
            
            # Extract main thumbnail ID if from Yandex or similar image CDN
            thumb_id = ""
            if "yandex.net" in img_key and "id=" in img_key:
                try:
                    thumb_id = img_key.split("id=")[1].split("&")[0]
                except Exception:
                    thumb_id = img_key

            dedup_key = thumb_id or img_key or url_key
            if not dedup_key or dedup_key in seen_keys:
                continue
            seen_keys.add(dedup_key)
            deduped.append(cand)
            if len(deduped) >= limit:
                break
        return deduped

    def _parse_google_lens_response(self, res) -> List[SearchCandidate]:
        candidates = []
        if not hasattr(res, "raw") or not res.raw:
            return []
        for idx, item in enumerate(res.raw):
            page_url = getattr(item, "url", None)
            title = getattr(item, "title", None)
            site_name = getattr(item, "site_name", None) or extract_domain(page_url)
            thumb = getattr(item, "thumbnail", None)

            if not page_url and not thumb:
                continue

            candidate = SearchCandidate(
                id=f"candidate-{idx + 1}",
                image_url=thumb,
                thumbnail_url=thumb,
                source=site_name,
                source_type=classify_source_type(page_url, site_name),
                title=title or site_name or "Visual Match Result",
                url=page_url
            )
            candidates.append(candidate)
        return self._deduplicate_and_limit(candidates)

    def _parse_yandex_response(self, res) -> List[SearchCandidate]:
        candidates = []
        if not hasattr(res, "raw") or not res.raw:
            return []
        for idx, item in enumerate(res.raw):
            page_url = getattr(item, "url", None)
            title = getattr(item, "title", None)
            source = getattr(item, "source", None) or extract_domain(page_url)
            thumb = getattr(item, "thumbnail", None)

            if not page_url and not thumb:
                continue

            candidate = SearchCandidate(
                id=f"candidate-{idx + 1}",
                image_url=thumb,
                thumbnail_url=thumb,
                source=source,
                source_type=classify_source_type(page_url, source),
                title=title or source or "Visual Match Result",
                url=page_url
            )
            candidates.append(candidate)
        return self._deduplicate_and_limit(candidates)

    def _parse_bing_response(self, res) -> List[SearchCandidate]:
        candidates = []
        items = []
        if hasattr(res, "pages_including") and res.pages_including:
            items.extend(res.pages_including)
        if hasattr(res, "visual_search") and res.visual_search:
            items.extend(res.visual_search)

        for idx, item in enumerate(items):
            page_url = getattr(item, "url", None)
            title = getattr(item, "title", None)
            thumb = getattr(item, "thumbnail", None)
            img_url = getattr(item, "image_url", None) or thumb
            domain = extract_domain(page_url)

            if not page_url and not img_url:
                continue

            candidate = SearchCandidate(
                id=f"candidate-{idx + 1}",
                image_url=img_url,
                thumbnail_url=thumb or img_url,
                source=domain,
                source_type=classify_source_type(page_url, domain),
                title=title or domain or "Visual Match Result",
                url=page_url
            )
            candidates.append(candidate)
        return self._deduplicate_and_limit(candidates)

    def _parse_baidu_response(self, res) -> List[SearchCandidate]:
        candidates = []
        if not hasattr(res, "raw") or not res.raw:
            return []
        for idx, item in enumerate(res.raw):
            page_url = getattr(item, "url", None)
            title = getattr(item, "title", None)
            thumb = getattr(item, "thumbnail", None)
            domain = extract_domain(page_url)

            if not page_url and not thumb:
                continue

            candidate = SearchCandidate(
                id=f"candidate-{idx + 1}",
                image_url=thumb,
                thumbnail_url=thumb,
                source=domain,
                source_type=classify_source_type(page_url, domain),
                title=title or domain or "Visual Match Result",
                url=page_url
            )
            candidates.append(candidate)
        return self._deduplicate_and_limit(candidates)


# Global search provider instance
search_provider = PicImageSearchProvider()

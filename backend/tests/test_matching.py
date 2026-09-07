import unittest
import numpy as np
from app.core.matching import compute_cosine_similarity, CandidateMatcher
from app.schemas.search import SearchCandidate

class TestDeduplicationAndSimilarity(unittest.TestCase):
    def test_compute_cosine_similarity(self):
        v1 = np.array([1.0, 0.0, 0.0])
        v2 = np.array([1.0, 0.0, 0.0])
        v3 = np.array([0.0, 1.0, 0.0])
        v4 = np.array([-1.0, 0.0, 0.0])

        self.assertAlmostEqual(compute_cosine_similarity(v1, v2), 1.0)
        self.assertAlmostEqual(compute_cosine_similarity(v1, v3), 0.0)
        self.assertAlmostEqual(compute_cosine_similarity(v1, v4), -1.0)

    def test_sha256_deduplication(self):
        c1 = SearchCandidate(id="c1", url="http://example.com/1", sha256="hash123", similarityScore=95.0, face_status="matched")
        c2 = SearchCandidate(id="c2", url="http://example.com/2", sha256="hash123", similarityScore=95.0, face_status="matched")
        c3 = SearchCandidate(id="c3", url="http://example.com/3", sha256="hash456", similarityScore=90.0, face_status="matched")

        candidates = [c1, c2, c3]
        seen = set()
        deduped = []
        for cand in candidates:
            if cand.sha256 in seen:
                continue
            seen.add(cand.sha256)
            deduped.append(cand)

        self.assertEqual(len(deduped), 2)
        self.assertEqual(deduped[0].id, "c1")
        self.assertEqual(deduped[1].id, "c3")

if __name__ == "__main__":
    unittest.main()

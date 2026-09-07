from typing import Dict, Any, Optional
import numpy as np


class MemoryEmbeddingStore:
    """
    In-memory store for 512-dimensional biometric embeddings.
    Biometric data is retained strictly in server memory during active workflow sessions
    and is never written to disk or sent to the browser client.
    """
    def __init__(self):
        self._embeddings: Dict[str, np.ndarray] = {}
        self._active_face_meta: Dict[str, Any] = {}

    def store_embedding(self, session_id: str, embedding: np.ndarray, metadata: Dict[str, Any]) -> None:
        self._embeddings[session_id] = embedding
        self._active_face_meta[session_id] = metadata

    def get_embedding(self, session_id: str) -> Optional[np.ndarray]:
        return self._embeddings.get(session_id)

    def get_metadata(self, session_id: str) -> Optional[Dict[str, Any]]:
        return self._active_face_meta.get(session_id)

    def clear(self, session_id: str) -> None:
        self._embeddings.pop(session_id, None)
        self._active_face_meta.pop(session_id, None)


# Global singleton instance for in-memory session persistence across endpoints
embedding_store = MemoryEmbeddingStore()

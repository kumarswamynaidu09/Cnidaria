import hashlib
import logging

logger = logging.getLogger(__name__)


def calculate_sha256(content: bytes) -> str:
    """
    Calculates a deterministic 64-character lowercase hexadecimal SHA-256 content digest
    from exact uncompressed/unmodified input bytes using Python standard library hashlib.
    """
    if content is None:
        content = b""
    return hashlib.sha256(content).hexdigest()

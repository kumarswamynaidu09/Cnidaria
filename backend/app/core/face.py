import io
import logging
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
import cv2
from PIL import Image

logger = logging.getLogger(__name__)

# Global singleton face analysis app model
_face_app = None


def get_face_analysis_model():
    """
    Lazy-loads and returns the InsightFace FaceAnalysis model instance.
    The model is initialized once on startup and reused across requests.
    Models are automatically cached locally under ~/.insightface/models/.
    """
    global _face_app
    if _face_app is None:
        logger.info("Initializing InsightFace FaceAnalysis model...")
        try:
            import insightface
            from insightface.app import FaceAnalysis

            # Use lightweight buffalo_l model with CPU execution provider
            _face_app = FaceAnalysis(
                name="buffalo_l",
                providers=["CPUExecutionProvider"]
            )
            _face_app.prepare(ctx_id=0, det_size=(640, 640))
            logger.info("InsightFace model initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize InsightFace model: {e}")
            raise e
    return _face_app


def decode_image_bytes(image_bytes: bytes) -> Optional[np.ndarray]:
    """
    Decodes raw image bytes into a BGR NumPy array suitable for OpenCV/InsightFace.
    Supports JPEG, PNG, WEBP, and common raster formats in memory.
    """
    if not image_bytes:
        return None

    # Try OpenCV native decoding
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is not None:
        return img

    # Fallback to Pillow decoding
    try:
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        # Convert RGB PIL Image to BGR OpenCV Image
        img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        return img
    except Exception as err:
        logger.warning(f"Failed to decode image bytes: {err}")
        return None


def detect_and_encode_face(img: np.ndarray) -> Tuple[int, Optional[Dict[str, Any]], Optional[str]]:
    """
    Runs face detection and ArcFace feature extraction on a BGR image array.
    
    Returns:
        Tuple[face_count, face_details, error_message]
    """
    app = get_face_analysis_model()
    faces = app.get(img)
    face_count = len(faces)

    if face_count == 0:
        return 0, None, "No face detected"

    if face_count > 1:
        return face_count, None, f"Multiple faces detected ({face_count}). Please upload an image containing one face."

    target_face = faces[0]
    bbox = [int(v) for v in target_face.bbox.astype(int).tolist()]
    confidence = float(target_face.det_score)
    embedding = target_face.embedding  # 512-dimensional float32 numpy array

    face_details = {
        "bbox": bbox,
        "detection_confidence": round(confidence, 4),
        "embedding_dimensions": int(embedding.shape[0]),
        "embedding": embedding
    }

    return 1, face_details, None

import uuid
import logging
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from fastapi.responses import JSONResponse

from app.schemas.scan import ScanResponse, FaceInfo, EmbeddingInfo, BoundingBox
from app.core.face import decode_image_bytes, detect_and_encode_face
from app.core.storage import embedding_store

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"
}


@router.post("/scan", response_model=ScanResponse)
async def scan_image(
    file: Optional[UploadFile] = File(None, description="Uploaded image file (field: file)"),
    image: Optional[UploadFile] = File(None, description="Uploaded image file (field: image)"),
    image_url: Optional[str] = Form(None, description="Remote image URL or preset reference"),
    preset: Optional[str] = Form("Elena", description="Preset character context")
):
    """
    Perform real face detection and 512-dimensional face embedding extraction using InsightFace.
    Biometric embedding vectors remain strictly in server memory and are not exposed in client responses.
    """
    upload = file or image
    image_bytes: Optional[bytes] = None

    if upload is not None:
        if upload.content_type and upload.content_type.lower() not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type '{upload.content_type}'. Please upload a JPEG, PNG, or WEBP image."
            )
        try:
            image_bytes = await upload.read()
        except Exception as err:
            logger.error(f"Error reading upload stream: {err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to read uploaded image stream."
            )
    elif image_url:
        # Remote URL / Preset reference fetching handling (for preset images)
        import urllib.request
        try:
            req = urllib.request.Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                image_bytes = resp.read()
        except Exception as err:
            logger.warning(f"Unable to fetch image from URL '{image_url}': {err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not download or read image from provided image_url."
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing image input. Provide a file upload in 'file' or 'image' field."
        )

    if not image_bytes or len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded image file is empty."
        )

    # Decode image in memory
    img = decode_image_bytes(image_bytes)
    if img is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Could not decode image data."
        )

    # Run InsightFace face detection & feature encoding
    try:
        face_count, face_details, error_msg = detect_and_encode_face(img)
    except Exception as err:
        logger.error(f"InsightFace processing failure: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal face processing error during neural landmark extraction."
        )

    if face_count == 0:
        return ScanResponse(
            success=False,
            face_count=0,
            error="No face detected",
            faceDetected=False,
            embeddingGenerated=False
        )

    if face_count > 1:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "face_count": face_count,
                "error": f"Multiple faces detected ({face_count}). Please upload an image containing one face.",
                "faceDetected": True,
                "embeddingGenerated": False
            }
        )

    # Single face detected successfully
    bbox = face_details["bbox"]
    x1, y1, x2, y2 = bbox
    w = max(0, x2 - x1)
    h = max(0, y2 - y1)

    # Store 512d embedding in server memory indexed by preset / active session
    session_id = preset or "default"
    embedding_store.store_embedding(
        session_id=session_id,
        embedding=face_details["embedding"],
        metadata={"bbox": bbox, "confidence": face_details["detection_confidence"]}
    )

    return ScanResponse(
        success=True,
        face_count=1,
        face=FaceInfo(
            bbox=bbox,
            detection_confidence=face_details["detection_confidence"],
            embedding=EmbeddingInfo(dimensions=face_details["embedding_dimensions"])
        ),
        faceDetected=True,
        embeddingGenerated=True,
        boundingBox=BoundingBox(x=x1, y=y1, w=w, h=h)
    )

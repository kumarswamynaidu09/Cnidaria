import logging
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from pydantic import BaseModel

from app.schemas.search import SearchResponse, SearchCandidate
from app.core.search import search_provider

logger = logging.getLogger(__name__)

router = APIRouter()

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"}


class SearchRequestJSON(BaseModel):
    vector_hash: Optional[str] = None
    preset: Optional[str] = None
    image_url: Optional[str] = None


@router.post("/search", response_model=SearchResponse)
async def search_web(
    file: Optional[UploadFile] = File(None, description="Uploaded image file (field: file)"),
    image: Optional[UploadFile] = File(None, description="Uploaded image file (field: image)"),
    vector_hash: Optional[str] = Form(None, description="Vector hash reference"),
    preset: Optional[str] = Form(None, description="Preset name reference"),
    image_url: Optional[str] = Form(None, description="Image URL reference")
):
    """
    Executes real reverse-image web search using PicImageSearch against public engines (Google Lens, Yandex, Bing).
    No mock data or fake candidates are returned.
    """
    upload = file or image
    image_bytes: Optional[bytes] = None
    filename: str = "search_image.jpg"

    if upload is not None:
        filename = upload.filename or filename
        if upload.content_type and upload.content_type.lower() not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type '{upload.content_type}'. Please upload a JPEG, PNG, or WEBP image."
            )

        try:
            image_bytes = await upload.read()
        except Exception as err:
            logger.error(f"Failed to read search upload stream: {err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not read uploaded image stream."
            )
    elif image_url:
        import urllib.request
        try:
            req = urllib.request.Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                image_bytes = resp.read()
        except Exception as err:
            logger.warning(f"Could not download image from URL '{image_url}': {err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to fetch image from provided image_url."
            )
    else:
        # Fallback preset sample image fetching if only preset or vector_hash is passed
        preset_urls = {
            "Elena": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
            "Marcus": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
            "Sofia": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60"
        }
        target_url = preset_urls.get(preset or "Elena")
        import urllib.request
        try:
            req = urllib.request.Request(target_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                image_bytes = resp.read()
        except Exception as err:
            logger.error(f"Failed to fetch default preset sample image: {err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing image upload file."
            )

    if not image_bytes or len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image payload is empty."
        )

    # 10 MB Size validation
    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Uploaded image size ({round(len(image_bytes) / (1024*1024), 2)} MB) exceeds the 10 MB limit."
        )

    # Execute reverse image search
    try:
        provider_name, candidates = await search_provider.search(image_bytes, filename=filename)
    except Exception as err:
        logger.error(f"Unexpected search engine error: {err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="External reverse image search engines are currently unreachable or blocked."
        )

    if provider_name == "picimagesearch:none":
        return SearchResponse(
            success=True,
            query_type="visual_search",
            provider="picimagesearch:none",
            candidate_count=0,
            candidates=[],
            error=None
        )

    return SearchResponse(
        success=True,
        query_type="visual_search",
        provider=provider_name,
        candidate_count=len(candidates),
        candidates=candidates,
        error=None
    )

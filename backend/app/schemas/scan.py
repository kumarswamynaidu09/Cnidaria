from typing import List, Optional
from pydantic import BaseModel, Field


class EmbeddingInfo(BaseModel):
    dimensions: int = Field(512, description="Dimension size of ArcFace feature embedding vector")


class FaceInfo(BaseModel):
    bbox: List[int] = Field(..., description="Bounding box [x1, y1, x2, y2] in pixels")
    detection_confidence: float = Field(..., description="Face detection confidence score (0.0 - 1.0)")
    embedding: EmbeddingInfo = Field(..., description="Metadata confirmation of embedding generation")


class BoundingBox(BaseModel):
    x: int
    y: int
    w: int
    h: int


class ScanResponse(BaseModel):
    success: bool
    face_count: int
    face: Optional[FaceInfo] = None
    error: Optional[str] = None

    # Frontend FaceDetails contract compatibility fields
    faceDetected: bool = False
    embeddingGenerated: bool = False
    boundingBox: Optional[BoundingBox] = None

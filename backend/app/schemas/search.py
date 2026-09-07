from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


class SearchCandidate(BaseModel):
    id: str = Field(..., description="Unique ID for candidate item")
    image_url: Optional[str] = Field(None, description="Direct URL to candidate image")
    thumbnail_url: Optional[str] = Field(None, description="Thumbnail preview URL")
    source: Optional[str] = Field(None, description="Source domain or site name")
    source_type: Optional[str] = Field("web", description="Categorized source type: social_media, news, video, academic, web")
    title: Optional[str] = Field(None, description="Web page title or asset description")
    url: Optional[str] = Field(None, description="Source web page URL")
    date: Optional[str] = Field(None, description="Publication date if available")

    # Task 4 Matching & Classification fields
    face_status: Optional[str] = Field("not_scanned", description="Processing status: matched, no_face, multiple_faces, image_unavailable, image_too_large, invalid_image, processing_error")
    match_classification: Optional[str] = Field(None, description="Classification label: Strong visual match, Likely visual match, Possible visual match, Weak visual match")

    # Frontend interface compatibility fields
    imageUrl: Optional[str] = Field(None, description="Frontend alias for image_url")
    similarity: Optional[float] = Field(None, description="ArcFace cosine similarity score (0.0 to 1.0)")
    similarityScore: Optional[float] = Field(None, description="Visual similarity percentage (0.0 to 100.0)")
    sha256: Optional[str] = Field(None, description="Reserved for Task 5 blockchain SHA-256 hash")

    @model_validator(mode="after")
    def populate_frontend_aliases(self):
        if not self.imageUrl and self.image_url:
            self.imageUrl = self.image_url
        return self


class SearchResponse(BaseModel):
    success: bool
    query_type: str = "visual_search"
    provider: str = Field(..., description="Search engine provider used (e.g., picimagesearch:yandex)")
    candidate_count: int = Field(0, description="Total deduplicated real candidates returned")
    matched_count: int = Field(0, description="Number of candidates successfully compared with detected face")
    candidates: List[SearchCandidate] = Field(default_factory=list)
    error: Optional[str] = None

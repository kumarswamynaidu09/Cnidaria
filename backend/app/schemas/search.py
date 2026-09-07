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

    # Frontend interface compatibility fields (aliased / populated if present)
    imageUrl: Optional[str] = Field(None, description="Frontend alias for image_url")
    similarity: Optional[float] = Field(None, description="Reserved for Task 4 ArcFace similarity matching")
    similarityScore: Optional[float] = Field(None, description="Reserved for Task 4 similarity score percentage")
    sha256: Optional[str] = Field(None, description="Reserved for Task 5 blockchain SHA-256 hash")

    @model_validator(mode="after")
    def populate_frontend_aliases(self):
        if not self.imageUrl and self.image_url:
            self.imageUrl = self.image_url
        return self


class SearchResponse(BaseModel):
    success: bool
    query_type: str = "visual_search"
    provider: str = Field(..., description="Search engine provider used (e.g., picimagesearch:google_lens)")
    candidate_count: int = Field(0, description="Total deduplicated real candidates returned")
    candidates: List[SearchCandidate] = Field(default_factory=list)
    error: Optional[str] = None

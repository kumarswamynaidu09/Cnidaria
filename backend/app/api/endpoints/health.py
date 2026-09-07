from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="cnidaria-api",
        version=settings.VERSION
    )

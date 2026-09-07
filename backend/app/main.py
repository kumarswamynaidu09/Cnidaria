from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.endpoints import health, scan, search, blockchain

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(scan.router, prefix=settings.API_V1_STR, tags=["Scan"])
app.include_router(search.router, prefix=settings.API_V1_STR, tags=["Search"])
app.include_router(blockchain.router, prefix=settings.API_V1_STR, tags=["Blockchain"])

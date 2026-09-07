from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Cnidaria API"
    PROJECT_DESCRIPTION: str = "Backend API for Cnidaria visual search and provenance verification."
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"

    FRONTEND_ORIGIN: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        origins = [self.FRONTEND_ORIGIN.rstrip("/")]
        if "localhost" in self.FRONTEND_ORIGIN:
            origins.append(self.FRONTEND_ORIGIN.replace("localhost", "127.0.0.1").rstrip("/"))
        elif "127.0.0.1" in self.FRONTEND_ORIGIN:
            origins.append(self.FRONTEND_ORIGIN.replace("127.0.0.1", "localhost").rstrip("/"))
        return list(set(origins))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

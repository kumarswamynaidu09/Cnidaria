# Cnidaria Backend API

Backend API for Cnidaria visual search and provenance verification built with FastAPI, InsightFace, and PicImageSearch.

## Features & Services

- **Health Check**: `GET /api/health`
- **Face Scanning & Encoding**: `POST /api/scan` (InsightFace ArcFace 512d embeddings)
- **Reverse Image Search**: `POST /api/search` (PicImageSearch with automatic engine fallback across Google Lens, Yandex, Bing, and BaiDu)

## Privacy & External Search Notice

> [!WARNING]
> During reverse image search (`POST /api/search`), the input image is transmitted to public external search engines (Google Lens, Yandex, Bing, BaiDu) via `PicImageSearch`. No biometric face embeddings or personal identity metadata are transmitted externally.

## Setup & Running

1. Activate virtual environment:
   ```bash
   .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

4. Interactive Swagger Documentation:
   `http://localhost:8000/docs`

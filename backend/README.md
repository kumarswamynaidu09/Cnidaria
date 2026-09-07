# Cnidaria Backend API

Backend API for Cnidaria visual search and provenance verification built with FastAPI.

## Setup & Running

1. Create & activate a virtual environment (optional/recommended):
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI development server (from the `backend/` directory):
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

4. Endpoints:
   - Health Check: `http://localhost:8000/api/health`
   - Interactive Swagger Docs: `http://localhost:8000/docs`

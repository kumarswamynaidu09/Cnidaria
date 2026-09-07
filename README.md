# Cnidaria — Visual Attribution & Content Provenance Engine

Cnidaria is an end-to-end visual attribution and decentralized content provenance framework. It combines real-time facial feature extraction, global reverse-image candidate searching, ArcFace cosine similarity ranking, SHA-256 cryptographic content fingerprinting, and EVM smart contract attestation on an Ethereum blockchain.

---

## Important Semantic Distinction

> **FACE SIMILARITY IS NOT IDENTITY PROOF.**
> The similarity score returned by ArcFace represents visual similarity between detected facial features in two images.
>
> **BLOCKCHAIN VERIFICATION IS CONTENT PROVENANCE VERIFICATION.**
> The blockchain verifies that the exact SHA-256 cryptographic fingerprint of a candidate image matches a registered record on the Ethereum ledger. It proves content registration, NOT personal identity.

---

## System Architecture

```
React (Vite)
  ↓
FastAPI Backend (http://127.0.0.1:8000)
  ↓
InsightFace / ArcFace (buffalo_l 512d embeddings)
  ↓
PicImageSearch / Yandex Reverse Search
  ↓
Real Candidate Image Fetching
  ↓
ArcFace Cosine Similarity Ranking
  ↓
SHA-256 Cryptographic Content Fingerprinting
  ↓
Hardhat EVM Ethereum Blockchain (http://127.0.0.1:8545)
  ↓
Real Registration & Provenance Reverification
```

---

## Getting Started

### 1. Hardhat Ethereum Blockchain

```bash
# In project root
npx hardhat node

# In another terminal, deploy the smart contract
npx hardhat run scripts/deploy.js --network localhost
```

The smart contract will be deployed to local address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`.

### 2. FastAPI Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (Python 3.10+)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

FastAPI OpenAPI docs available at: `http://127.0.0.1:8000/docs`

### 3. Vite React Frontend

```bash
# Create .env in project root
VITE_API_URL=http://127.0.0.1:8000

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## Environment Configuration

| Variable | Mode | Description |
|---|---|---|
| `VITE_API_URL=http://127.0.0.1:8000` | Real API Mode | Connects frontend directly to FastAPI backend & Hardhat node |
| (Unset / Omitted) | Fallback Mock Mode | Uses `mockApi.ts` for offline/demo operation without backend |

---

## API Endpoints

- `GET /api/health` — Backend health check & dependency status
- `POST /api/scan` — Face detection & 512d ArcFace embedding generation
- `POST /api/search` — Reverse-image search & ArcFace candidate ranking
- `POST /api/blockchain/register` — On-chain SHA-256 fingerprint registration
- `POST /api/blockchain/verify` — Smart contract fingerprint verification audit
- `POST /api/verify` — Compatibility endpoint for full verification sequence

---

## Build Verification

To run a production frontend build check:

```bash
npm run build
```

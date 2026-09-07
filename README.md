<p align="center">
  <img src="public/cnidaria-banner.jpg" alt="Cnidaria Banner" width="600" />
</p>

# Cnidaria — Visual Attribution & Content Provenance Engine

Cnidaria is an end-to-end visual attribution and decentralized content provenance framework. It combines real-time facial feature extraction, global reverse-image candidate searching, ArcFace cosine similarity ranking, SHA-256 cryptographic content fingerprinting, and EVM smart contract attestation on an Ethereum blockchain.

---

## 5-MINUTE DEMO 

Follow these quick steps to execute a complete end-to-end live demo:

### Step 1: Start Hardhat Local Blockchain
```bash
# Terminal 1 (Project Root)
npx hardhat node
```
*Mines local blocks at `http://127.0.0.1:8545`.*

### Step 2: Deploy Provenance Smart Contract
```bash
# Terminal 2 (Project Root)
npx hardhat run scripts/deploy.js --network localhost
```
*Deploys `CnidariaProvenance.sol` to address `0x5FbDB2315678afecb367f032d93F642f64180aa3`.*

### Step 3: Start FastAPI Backend
```bash
# Terminal 2 (Backend Directory)
cd backend
.venv\Scripts\activate   # (or source .venv/bin/activate on Linux/macOS)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Runs backend pipeline API at `http://127.0.0.1:8000`.*

### Step 4: Launch Vite Frontend
```bash
# Terminal 3 (Project Root)
npm run dev
```
*Open browser at `http://localhost:3000`.*

### Step 5: Test the Live Pipeline
1. **Upload / Select Preset**: Click Elena preset or upload any custom photo.
2. **Scan & Detect**: InsightFace detects bounding boxes & extracts 512d ArcFace embeddings (`POST /api/scan`).
3. **Reverse Search & ArcFace Rank**: PicImageSearch queries reverse engines; ArcFace ranks candidate images by cosine similarity (`POST /api/search`).
4. **Select Match & Inspect**: View candidate metadata & real SHA-256 hash calculated from candidate byte payload.
5. **Register & Verify Provenance**: Click "Verify provenance". On-chain EVM transaction mines on Hardhat node (`POST /api/blockchain/register` & `/api/blockchain/verify`).
6. **Tamper Proofing Demo**: Click "Simulate tampering" to modify 1 byte of content. Watch the UI instantly show **Verification Failed** because `original_sha256 != tampered_sha256`.

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

## Build & Test Verification

```bash
# Run production build
npm run build
```

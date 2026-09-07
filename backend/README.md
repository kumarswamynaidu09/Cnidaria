# Cnidaria Backend API

Backend API for Cnidaria visual search, content fingerprinting, and blockchain provenance verification built with FastAPI, InsightFace, PicImageSearch, and Ethereum (Solidity / Hardhat).

## Features & Endpoints

- **Health Check**: `GET /api/health`
- **Face Scanning & Encoding**: `POST /api/scan` (InsightFace ArcFace 512d embeddings)
- **Reverse Image Search & Candidate Matching**: `POST /api/search` (PicImageSearch + ArcFace cosine similarity ranking)
- **On-Chain Provenance Registration**: `POST /api/blockchain/register`
- **On-Chain Provenance Verification**: `POST /api/blockchain/verify`

## Local Blockchain Setup & Deployment

1. Navigate to the blockchain workspace:
   ```bash
   cd backend/blockchain
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start local Hardhat Ethereum node:
   ```bash
   npx hardhat node
   ```

4. Deploy `CnidariaProvenance.sol` smart contract (in a separate terminal):
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   *The deployment script will automatically save contract address metadata to `deployment-info.json`.*

## Environmental Configuration

Environment variables (supported via `.env` or defaults):
- `BLOCKCHAIN_RPC_URL`: `http://127.0.0.1:8545`
- `BLOCKCHAIN_CONTRACT_ADDRESS`: Deployed EVM contract address
- `BLOCKCHAIN_PRIVATE_KEY`: Hardhat Account #0 default local private key

## Cryptographic Content Fingerprinting & Provenance Model

- **bytes32 SHA-256 Digest**: 64-character lowercase hex digest generated directly from exact downloaded candidate bytes is registered on-chain in `CnidariaProvenance.sol`.
- **Zero Biometrics On-Chain**: **No images, no face crops, and no ArcFace embeddings** are stored on-chain.
- **Tamper Verification**: Modifying even 1 byte in a candidate image changes its SHA-256 digest, causing `verifyFingerprint` to return `registered = false`.

> [!NOTE]
> **Provenance Disclaimer**: Blockchain verification proves that the exact registered content fingerprint matches. It does not prove the legal identity of the person depicted in the image, nor does it independently prove that the external web source is authentic.

## Setup & Running FastAPI Server

1. Activate Python virtual environment:
   ```bash
   .venv\Scripts\activate
   ```

2. Start development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

3. Interactive Swagger Documentation:
   `http://localhost:8000/docs`

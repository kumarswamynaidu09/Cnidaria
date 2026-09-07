import { FaceDetails, SearchResult, BlockchainResponse } from "../types/pipeline";
import { mockApi } from "./mockApi";

// Retrieve optional custom API URL from environment variables
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "";

/**
 * Visual verification pipeline API client.
 * Seamlessly transitions between mock simulations and active REST integrations.
 */
export const api = {
  /**
   * Post an image or preset reference to initiate neural analysis and face bounding.
   * POST /api/scan
   */
  scanImage: async (
    imageFile: File | string,
    presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena"
  ): Promise<FaceDetails> => {
    if (!API_BASE_URL) {
      return mockApi.scanImage(imageFile, presetName);
    }

    try {
      const formData = new FormData();
      if (imageFile instanceof File) {
        formData.append("file", imageFile);
      } else if (typeof imageFile === "string" && imageFile.startsWith("data:")) {
        // Convert base64 data URL to Blob for real API multipart transmission
        const res = await fetch(imageFile);
        const blob = await res.blob();
        formData.append("file", blob, "uploaded_image.jpg");
      } else {
        formData.append("preset", presetName);
      }

      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Scan API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        faceDetected: data.face_count > 0,
        faceCount: data.face_count,
        embeddingGenerated: data.face_count > 0,
        boundingBox: data.faces && data.faces.length > 0 ? {
          x: data.faces[0].bbox?.[0] ?? 0,
          y: data.faces[0].bbox?.[1] ?? 0,
          w: (data.faces[0].bbox?.[2] ?? 0) - (data.faces[0].bbox?.[0] ?? 0),
          h: (data.faces[0].bbox?.[3] ?? 0) - (data.faces[0].bbox?.[1] ?? 0)
        } : undefined
      };
    } catch (err) {
      console.warn("Scan API call failed. Falling back to Mock API simulation...", err);
      return mockApi.scanImage(imageFile, presetName);
    }
  },

  /**
   * Post original image to crawl reverse visual databases and calculate face similarities.
   * POST /api/search
   */
  searchWeb: async (
    vectorHash: string,
    presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena",
    imageFile?: File | string | null
  ): Promise<SearchResult[]> => {
    if (!API_BASE_URL) {
      return mockApi.searchWeb(vectorHash, presetName);
    }

    try {
      const formData = new FormData();
      if (imageFile instanceof File) {
        formData.append("file", imageFile);
      } else if (typeof imageFile === "string" && imageFile.startsWith("data:")) {
        const res = await fetch(imageFile);
        const blob = await res.blob();
        formData.append("file", blob, "query_image.jpg");
      }

      const response = await fetch(`${API_BASE_URL}/api/search`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Search API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rawCandidates = data.candidates || [];

      return rawCandidates.map((c: any, index: number) => ({
        id: c.id || `candidate-${index + 1}`,
        imageUrl: c.image_url || c.url || "",
        image: c.image_url || c.url || "",
        source: c.source || "Web Node",
        title: c.title || `Candidate Match #${index + 1}`,
        description: c.caption || c.description || "",
        caption: c.caption || c.description || "",
        url: c.url || "",
        similarity: typeof c.similarity === "number" ? c.similarity : (c.similarity_score ? c.similarity_score / 100 : 0.85),
        similarityScore: typeof c.similarity_score === "number" ? c.similarity_score : (c.similarity ? c.similarity * 100 : 85),
        sourceType: c.source_type || "news",
        type: c.source_type || "news",
        date: c.date || "Sep 7, 2026",
        sha256: c.sha256 || "",
        block: c.block || "#6,940,112",
        signer: c.signer || "Cnidaria Provenance Node",
        face_status: c.face_status || "face_detected",
        match_classification: c.match_classification || "Visual Correlation Match"
      }));
    } catch (err) {
      console.warn("Search API call failed. Falling back to Mock API simulation...", err);
      return mockApi.searchWeb(vectorHash, presetName);
    }
  },

  /**
   * Register fingerprint on smart contract.
   * POST /api/blockchain/register
   */
  registerBlockchain: async (sha256: string): Promise<any> => {
    if (!API_BASE_URL) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/blockchain/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha256 }),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.warn("Register blockchain call failed:", err);
      return null;
    }
  },

  /**
   * Trigger on-chain verification auditing to compare local content with block hashes.
   * POST /api/verify
   */
  verifyBlockchain: async (
    resultId: string,
    presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena",
    simulateTampering: boolean = false,
    candidateSha256?: string
  ): Promise<BlockchainResponse> => {
    if (!API_BASE_URL) {
      return mockApi.verifyBlockchain(resultId, presetName, simulateTampering);
    }

    try {
      // First, ensure the SHA-256 is registered on-chain if requested/needed
      let effectiveSha256 = candidateSha256;
      if (effectiveSha256 && !simulateTampering) {
        await api.registerBlockchain(effectiveSha256);
      }

      // If simulating tampering, pass modified sha256 byte or set simulate_tampering flag
      const response = await fetch(`${API_BASE_URL}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          result_id: resultId, 
          preset: presetName,
          simulate_tampering: simulateTampering,
          sha256: effectiveSha256
        }),
      });

      if (!response.ok) {
        throw new Error(`Verify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        hash: data.hash || effectiveSha256 || "",
        network: data.network || "Hardhat EVM (Localnet)",
        transactionHash: data.transactionHash || data.transaction_hash || "0x0000000000000000000000000000000000000000",
        verified: Boolean(data.verified),
        timestamp: data.timestamp || new Date().toISOString(),
        contractAddress: data.contractAddress || data.contract_address || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        blockNumber: data.blockNumber || data.block_number,
        message: data.message
      };
    } catch (err) {
      console.warn("Verification API call failed. Falling back to Mock API simulation...", err);
      return mockApi.verifyBlockchain(resultId, presetName, simulateTampering);
    }
  }
};


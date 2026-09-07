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
        formData.append("image", imageFile);
      } else {
        formData.append("image_url", imageFile);
      }
      formData.append("preset", presetName);

      const response = await fetch(`${API_BASE_URL}/api/scan`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Scan API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn("Scan API call failed. Falling back to Mock API simulation...", err);
      return mockApi.scanImage(imageFile, presetName);
    }
  },

  /**
   * Post encoded landmarks/vector hash to crawl reverse visual databases.
   * POST /api/search
   */
  searchWeb: async (
    vectorHash: string,
    presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena"
  ): Promise<SearchResult[]> => {
    if (!API_BASE_URL) {
      return mockApi.searchWeb(vectorHash, presetName);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vector_hash: vectorHash, preset: presetName }),
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn("Search API call failed. Falling back to Mock API simulation...", err);
      return mockApi.searchWeb(vectorHash, presetName);
    }
  },

  /**
   * Trigger on-chain verification auditing to compare local content with block hashes.
   * POST /api/verify
   */
  verifyBlockchain: async (
    resultId: string,
    presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena",
    simulateTampering: boolean = false
  ): Promise<BlockchainResponse> => {
    if (!API_BASE_URL) {
      return mockApi.verifyBlockchain(resultId, presetName, simulateTampering);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          result_id: resultId, 
          preset: presetName,
          simulate_tampering: simulateTampering 
        }),
      });

      if (!response.ok) {
        throw new Error(`Verify API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn("Verification API call failed. Falling back to Mock API simulation...", err);
      return mockApi.verifyBlockchain(resultId, presetName, simulateTampering);
    }
  }
};

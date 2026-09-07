export type PipelineState =
  | "idle"
  | "image_selected"
  | "scanning"
  | "face_detected"
  | "face_encoding"
  | "face_encoded"
  | "searching"
  | "search_complete"
  | "results"
  | "result_selected"
  | "result_detail"
  | "verifying"
  | "verified"
  | "error";

export type FaceDetection = {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  width: number; // width percentage (0-100)
  height: number; // height percentage (0-100)
  confidence: number;
};

export interface FaceDetails {
  faceDetected: boolean;
  faceCount: number;
  embeddingGenerated: boolean;
  boundingBox?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface SearchResult {
  id: string;
  imageUrl: string;
  source: string;
  title: string;
  description?: string;
  url: string;
  similarity: number; // 0.0 to 1.0 (e.g., 0.924)
  date?: string;
  type?: "news" | "social" | "academic" | "other";
  sha256: string;
  block?: string;
  signer?: string;
}

export interface BlockchainResponse {
  hash: string;
  network: string;
  transactionHash: string;
  verified: boolean;
  timestamp: string;
  contractAddress?: string;
}

export interface PipelineError {
  type: "invalid_image" | "no_face" | "multiple_faces" | "search_failed" | "no_results" | "verification_failed" | "api_error";
  message: string;
  suggestion?: string;
}

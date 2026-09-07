export interface BlockchainVerificationData {
  network: string;
  status: string;
  currentFingerprint: string;
  registeredFingerprint: string;
  transactionHash: string;
  timestamp: string;
}

// Separate mock data registry as requested in Section 13
export const mockBlockchainVerification: BlockchainVerificationData = {
  network: "Cnidaria Local Test Network",
  status: "verified",
  currentFingerprint: "7f83b1657ff1fc53b92dc18148a1d65dfa135e5f3fc1a9d8e7c6b5a4d3c2b1a0",
  registeredFingerprint: "7f83b1657ff1fc53b92dc18148a1d65dfa135e5f3fc1a9d8e7c6b5a4d3c2b1a0",
  transactionHash: "0x8f3a9e7d8c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0",
  timestamp: "September 7, 2026"
};

export const tamperedFingerprint = "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8";

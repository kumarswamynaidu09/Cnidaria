import { FaceDetails, SearchResult, BlockchainResponse } from "../types/pipeline";

// High-quality mock results matching the visual theme
export const MOCK_RESULTS: Record<string, SearchResult[]> = {
  Elena: [
    {
      id: "elena-1",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxlzbSvVBXr5t-QgWn_CeQjw5Jza4mn_q3uOT_O1MPwIr0LxoGglBeeBWf83hoQ7Ri-PZIgxPWDjmYdKp-VZQ4DR4m1zBypePUFTBosfmFCftZUDWR-GoTgbFmb1gYJQYYz47YyjF1oH5LV_9s7RMOGgNWriHk91gH7Vyu30wT9B3X6ursVcQx2q5H0f1rURHIlTjG-PACvcmL4SjyxQaD1BOe2Bu3klng7euRgCgl8SMOqOJgh1xUJg",
      source: "Reuters Syndicate",
      title: "Global AI Consensus Summit: Keynote Speaker Attributions",
      url: "https://reuters.com/investigations/ai-ethics-summit-keynote-elena-rostova",
      similarity: 0.964,
      date: "Oct 14, 2024",
      type: "news",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      block: "#6,940,112",
      signer: "Reuters Cryptographic Node #4"
    },
    {
      id: "elena-2",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa_zT_ULe6ita0VY58MvugKz2PiLtVk9POcKU2YTuF7FxFbpGlev7vyK7ZmU2djwslLsojB8hTmLfmVrf9z2pzDfDny-ZwipsXAMU8n0T13AKtD0XTNUSJj0g58MDAVNAYlc7krcssoZUyX4Imuk-tnuE0uzPi-bxYdvu7QQJvRzaz_AsJ9b668etJZEnsWpq97wzLEP0TTbhootETFx106ZSB8wO3F8vlpY08C8gPS7_QtBVDoF34YA",
      source: "Substack DeepDive",
      title: "The Architecture of Zero-Knowledge Visual Watermarking",
      url: "https://deepdive.substack.com/p/architecture-zero-knowledge-visual-watermarks",
      similarity: 0.941,
      date: "Nov 02, 2024",
      type: "news",
      sha256: "8c1d3f903a42b10998a4421be34d0928aa1192809fec9001bfa82910fae4483a",
      block: "#6,938,901",
      signer: "Substack Editorial Validator #1"
    },
    {
      id: "elena-3",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6Gd4t50smzrufHQtObWoOSIONjeW0Tz2aLBZAgBx-xXWr59xmIGoCET-bwq15m1UGUQFfmi3Iyn_DNUDtmb04gFgmr3RSR7Wf34w83052uRPeZnlZjLY2s3saA4PGPcEoQvTlQqk_eigKBGt1TSMFPRH8z9QlrA9NrGiPyLeWD_DQRXeAtYZ13rvq91xnvLIIjW9UHZZMJ8Fw9lZRoAMxlbLhLYN94WnFgNyBTHCpE5qLCnWDSSS_SA",
      source: "ArXiv Repository",
      title: "Co-Author Citation: Neural Hash Embeddings for Immutable Media",
      url: "https://arxiv.org/abs/2411.0891",
      similarity: 0.918,
      date: "Aug 19, 2024",
      type: "academic",
      sha256: "91fae82110c9d744b10081cae40291fcdd019485bb21980004918ef930219481",
      block: "#6,921,440",
      signer: "CERN Academic Attestation Relay"
    },
    {
      id: "elena-4",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4OBwqgwcvoHj98khaxzuI8yAlxreIhTdQZLI89_0EGufKcPDP79MScoLoDk6F79C4i9P6vayc8nrYAsPlrSZ8wxk7bAPRAu7TVJxh1BRkojgIDY08ubRWU973KmKypbVGrXn0Cy5ZCTcxmLu2lUHPq66Y0qB4JOo0f2m0Z7o8lNMO5ONJxdjHkcj-SVbgJr-A1DWxUromgLc0wQjmLRcsZ6HFECffjh3xaAOozxaMaICr9Ah11NpLkw",
      source: "X / Verified Post",
      title: "@ConsensusLab Announcement Thread",
      url: "https://x.com/ConsensusLab/status/18312904812",
      similarity: 0.905,
      date: "Sep 04, 2024",
      type: "social",
      sha256: "33b4119c8309100fae9291093849182390a8819ef39019284901924890192834",
      block: "#6,930,121",
      signer: "ConsensusLab Node #09"
    },
    {
      id: "elena-5",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAheDT5twaEJ4Vy14j__WclawSJ1njyQTUIPKHLp13EtooonmfIwd5gdchmOseTsfJg7CN9-gwwkn-U6yH9-33GMFRz49vjRXlNwIyTQl0LWT6sJCGxLAXFLFkkt1U6lVQHetQtoIUXo7rcZRUefxC1CSoj_Ec0OS4ghzfmqNLSsURtwMdaMjE3KNcTeIBVcgEQeEM6JShb7czHvGERvmgruv4n4IzSk3Z4IeU5-U6mFYob7V0UExA0Lw",
      source: "LinkedIn Member",
      title: "Principal Cryptographic Scientist Profile",
      url: "https://linkedin.com/in/elena-rostova-cryptography",
      similarity: 0.882,
      date: "Oct 21, 2024",
      type: "social",
      sha256: "77a092dc01928301928491029384019238491029384019283401928340192834",
      block: "#6,929,881",
      signer: "Identity Trust Network"
    },
    {
      id: "elena-6",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtPMnumUsbT586RSUFP4VWYCe912_gt8rHjmfTIP9cPdTpZkdbd9rWPq8Fev6lShZ7OjvLO_K0cWNJCTz7gRiTO4QGlfjStnhCzxGyHzFsPcYsSDn-Bq-HRYXGyvO9ada-JpjBy3_caNwBWuvmQhdERNEcY91HedAWnmWYIFzGsqs7MCGu8hkSPNat0ox4ZckAebX8Y5dJnP3WfUpmmV2oe33uxgGNxc7MFn6wIXr649UK7kW7IVWvAw",
      source: "GitHub Commit Author",
      title: "Repository Maintainer: lenstrace-core-contracts",
      url: "https://github.com/lenstrace/core-contracts/commit/82ab91cd",
      similarity: 0.870,
      date: "Nov 18, 2024",
      type: "social",
      sha256: "e119fa8409182309182309481029384019283401928340192834019283401928",
      block: "#6,942,001",
      signer: "GitHub Verified GPG Daemon"
    }
  ],
  Marcus: [
    {
      id: "marcus-1",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMb7gb0ujA0m-zTLr9_d2swLsEiJZ9Dbew_WkllZPcDCpLlkRzY5GosfduSCk9BSsFEZP9f8_0VX9HUJnEeTmZOJef_wK-Cwblc892dMC8htQmavWEsCQox7en4jo9_pAAzdxU9Nr0n5skYk-A4gleA_i3A_mFC8P_Jo049YnkPWX74GPtxaW0pxLcbLy5-Fi8DpPJLQBV1Pgu0TK-8nS4SdcQxVfQWRUNAZWUC-ere1TSUcc1JadNQ",
      source: "TechCrunch Wire",
      title: "Vance Tech Labs Raises $12M for Provable Neural Signatures",
      url: "https://techcrunch.com/2024/09/10/vance-tech-labs-seed-provable-neural-signatures",
      similarity: 0.952,
      date: "Sep 10, 2024",
      type: "news",
      sha256: "8e7a42b109e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca4959a",
      block: "#6,912,404",
      signer: "TechCrunch Media Registrar #1"
    },
    {
      id: "marcus-2",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMb7gb0ujA0m-zTLr9_d2swLsEiJZ9Dbew_WkllZPcDCpLlkRzY5GosfduSCk9BSsFEZP9f8_0VX9HUJnEeTmZOJef_wK-Cwblc892dMC8htQmavWEsCQox7en4jo9_pAAzdxU9Nr0n5skYk-A4gleA_i3A_mFC8P_Jo049YnkPWX74GPtxaW0pxLcbLy5-Fi8DpPJLQBV1Pgu0TK-8nS4SdcQxVfQWRUNAZWUC-ere1TSUcc1JadNQ",
      source: "X / Entrepreneur Feed",
      title: "Marcus Vance @VanceStartup Founding Board Update",
      url: "https://x.com/vance_marcus/status/193821034",
      similarity: 0.912,
      date: "Oct 01, 2024",
      type: "social",
      sha256: "d0928aa1192809fec9001bfa82910fae4483a8c1d3f903a42b10998a4421be34",
      block: "#6,928,112",
      signer: "X Public Ledger Node #12"
    }
  ],
  Sofia: [
    {
      id: "sofia-1",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewg-jTfm7XFdZpKxrPHSdUaLfK6VEfID9ck0_bSefb7uV5aGm9qoGFsybNOwA8InSWj7XTayNXtZznp2hl6kuHiWH6S0uGItkMB3Rf8esUZbr-4Oq7bulon7qH9JtO2PlUqwNsxTjORktor3dNRDzQwSOtVuK7Bj0F3gawMui-KYobnGBJ25sSbQ5tYmM6Ieqstp0ZPHZizxGp9cRiQiPeVRmjJjJz7huFrP1ID6kzHL2CInCppzXog",
      source: "Investigative Press Syndicate",
      title: "Special Report: Verifying Photojournalism Authenticity in Conflict Zones",
      url: "https://press-syndicate.org/report/sofia-chen-photojournalism-authenticity",
      similarity: 0.978,
      date: "Aug 02, 2024",
      type: "academic",
      sha256: "91e8ef93021948191fae82110c9d744b10081cae40291fcdd019485bb2198000",
      block: "#6,904,011",
      signer: "IPS Ledger Witness #2"
    }
  ]
};

// Simulated timing in ms
export const TIMING = {
  scan: 3500,        // 3.5s total for face scan
  search: 4500,      // 4.5s total for web search
  verify: 3200       // 3.2s total for blockchain verification
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock API layer mimicking actual backend payloads
 */
export const mockApi = {
  scanImage: async (imageFile: File | string, presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena"): Promise<FaceDetails> => {
    await delay(1200); // initial delay for api connection
    if (presetName === "Custom" && typeof imageFile === "string" && imageFile.includes("empty")) {
      return {
        faceDetected: false,
        faceCount: 0,
        embeddingGenerated: false
      };
    }
    return {
      faceDetected: true,
      faceCount: 1,
      embeddingGenerated: true,
      boundingBox: { x: 412, y: 198, w: 240, h: 310 }
    };
  },

  searchWeb: async (vectorHash: string, presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena"): Promise<SearchResult[]> => {
    await delay(1500); // mock query translation delay
    const results = MOCK_RESULTS[presetName] || MOCK_RESULTS.Elena;
    return results;
  },

  verifyBlockchain: async (
    resultId: string, 
    presetName: "Elena" | "Marcus" | "Sofia" | "Custom" = "Elena",
    simulateTampering: boolean = false
  ): Promise<BlockchainResponse> => {
    await delay(2000); // mock smart-contract querying delay

    const allMockResults = Object.values(MOCK_RESULTS).flat();
    const activeResult = allMockResults.find(r => r.id === resultId);
    
    const baseHash = activeResult ? activeResult.sha256 : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    const onChainHash = baseHash;
    // If tampered, generate a randomized different local hash
    const localHash = simulateTampering ? "a91f237bc901842bc1128394afbe128d9c284eef93cb109a823bf19a12bc900f" : baseHash;

    return {
      hash: onChainHash, // On-chain hash remains authentic
      network: "Ethereum Sepolia",
      transactionHash: "0x82ab91cd" + Math.random().toString(16).substring(2, 10) + "3849102",
      verified: !simulateTampering,
      timestamp: new Date().toISOString(),
      contractAddress: "0x742d" + Math.random().toString(16).substring(2, 6) + "e29384e8"
    };
  }
};

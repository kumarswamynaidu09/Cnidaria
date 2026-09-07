export interface PresetData {
  id: "Elena" | "Marcus" | "Sofia";
  displayName: string;
  fileName: string;
  fileSize: string;
  dimensions: string;
  statusText: string;
  thumbUrl: string;
  scanUrl: string;
  referenceUrl: string;
  croppedRefUrl: string;
  croppedMatchUrl: string;
  vectorHash: string;
  consensusRoot: string;
  attestationText: string;
  metadataCountText: string;
}

export const PRESETS: Record<"Elena" | "Marcus" | "Sofia", PresetData> = {
  Elena: {
    id: "Elena",
    displayName: "Analyst Portrait (Elena)",
    fileName: "Elena_Rostova_Keynote_2024.jpg",
    fileSize: "3.8 MB",
    dimensions: "2400x2400",
    statusText: "Ready for spatial feature embedding & Sepolia provenance lookup.",
    thumbUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJXAQ3vc_9aUciOv5etp1gA9egnXVKKSbiv6xpGw-N2v5gGWeNqkI_MYyHBvwkMx92WzEP8QiWQXxVxAWWNa_Dhtve3EBcxyVF83PfpxgryDXxAFwOzQ2C5wvE5PrVaDh_0LcKP25ySbwRL5V9OlXOSKrxubjl7AH6IUxo2ggXlumygbzFQySs6kl0Txy6rkZVu0BnyFlfnvR3k7HosxYAV_XW9edBr7m7AITfpmvs6-EvAFZnzSzJgQ",
    scanUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5yzVCou38BdjgPUvFU-AOD196rr1-5xlZ5a2zC4xFBSWfBiGVVUgONBXtP1FwsQJ7VhRjkan4pt8zrVVUJquR4ZSJhnBhpxRy78C9bTcOdOH12I1WgtzvSv1YsqGEits9BM_fdLryoKR0y5wH8BWjYUJy6PnLNwYmVF1VyiZOrWA3AzGU_OKjBOoXCW5BpSewNQvXicze4rfU35iODoa8tSigfRVJXs0K4OvJf2KXVeDiWypoI4stbw",
    referenceUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCmFOLIwmNzolGeIL1WYKchHwAUI2B9ZUOu5KijvC3-e712JPbxjiWJckSfbDSox_oDNsyCqU-HK1xkb2lhHTxEV72I61QQewjCphhq2ZSlcGHG5d3tVOYY8znMw7WZG0yv292kqPMmuUBxUkDMOQH2UcjXwowohhSi5AzoD-E_S2JW_IzhrFrXY0dx6pi77n1BjCGgs9K_BP-28VFfPp4r_JGcGFbe7Kkp8rCuVMpf66CbInxCWIkdA",
    croppedRefUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVVOt2biyn8y5jLd636IWYCL9e_kmHPMx35WPuuXQDcG550q1H47H_uNAYpC75dEHtnn3X4IoA1pBKQZxh0af_8DNyBgHIEEP22IsioSOcJ6yA8ccIsyn1_UXaASsyAZ1ZcmbxL1l_t5_yD8xbIPwhbQp2MV22r7vwP5rc4g3lV5DyVXIxWXScXxGHmXezp0QcbRya4Wo-j1vMIOISZulE8VfjSpJshq0G2zaesdX54msGub3Q-TGkvg",
    croppedMatchUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzLK6uKwawZbe1Ai7y7KEaGEZpoRfSAT8or4PHP6JEgfGhlpiwk6j5fO7nmZNcDimxuo_tBNadOKv0nMpmY8xJAYFj4Umm3QZNDk86ucAmZjedYrfQYviVsxpX2m7oKoi7aUOBdIgFCXADDQpBsuvhUfwCGcOzgNVVcdliEs2Wr3G4m0F04mfm-yaRki418vdvADTIXboF2nVFUG7mh_p66t1xGt2kJedu-hq93wmEAGwTnwANw-LIrw",
    vectorHash: "7f8a...309d",
    consensusRoot: "0x82ab...91cd",
    attestationText: "Provenance Synced",
    metadataCountText: "8 verified matches found"
  },
  Marcus: {
    id: "Marcus",
    displayName: "Tech Founder Photo",
    fileName: "Marcus_Vance_Founder_Studio.png",
    fileSize: "5.2 MB",
    dimensions: "3200x3200",
    statusText: "Ready for biometric encoding and network citation verification.",
    thumbUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMb7gb0ujA0m-zTLr9_d2swLsEiJZ9Dbew_WkllZPcDCpLlkRzY5GosfduSCk9BSsFEZP9f8_0VX9HUJnEeTmZOJef_wK-Cwblc892dMC8htQmavWEsCQox7en4jo9_pAAzdxU9Nr0n5skYk-A4gleA_i3A_mFC8P_Jo049YnkPWX74GPtxaW0pxLcbLy5-Fi8DpPJLQBV1Pgu0TK-8nS4SdcQxVfQWRUNAZWUC-ere1TSUcc1JadNQ",
    scanUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMb7gb0ujA0m-zTLr9_d2swLsEiJZ9Dbew_WkllZPcDCpLlkRzY5GosfduSCk9BSsFEZP9f8_0VX9HUJnEeTmZOJef_wK-Cwblc892dMC8htQmavWEsCQox7en4jo9_pAAzdxU9Nr0n5skYk-A4gleA_i3A_mFC8P_Jo049YnkPWX74GPtxaW0pxLcbLy5-Fi8DpPJLQBV1Pgu0TK-8nS4SdcQxVfQWRUNAZWUC-ere1TSUcc1JadNQ",
    referenceUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMb7gb0ujA0m-zTLr9_d2swLsEiJZ9Dbew_WkllZPcDCpLlkRzY5GosfduSCk9BSsFEZP9f8_0VX9HUJnEeTmZOJef_wK-Cwblc892dMC8htQmavWEsCQox7en4jo9_pAAzdxU9Nr0n5skYk-A4gleA_i3A_mFC8P_Jo049YnkPWX74GPtxaW0pxLcbLy5-Fi8DpPJLQBV1Pgu0TK-8nS4SdcQxVfQWRUNAZWUC-ere1TSUcc1JadNQ",
    croppedRefUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMb7gb0ujA0m-zTLr9_d2swLsEiJZ9Dbew_WkllZPcDCpLlkRzY5GosfduSCk9BSsFEZP9f8_0VX9HUJnEeTmZOJef_wK-Cwblc892dMC8htQmavWEsCQox7en4jo9_pAAzdxU9Nr0n5skYk-A4gleA_i3A_mFC8P_Jo049YnkPWX74GPtxaW0pxLcbLy5-Fi8DpPJLQBV1Pgu0TK-8nS4SdcQxVfQWRUNAZWUC-ere1TSUcc1JadNQ",
    croppedMatchUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNMb7gb0ujA0m-zTLr9_d2swLsEiJZ9Dbew_WkllZPcDCpLlkRzY5GosfduSCk9BSsFEZP9f8_0VX9HUJnEeTmZOJef_wK-Cwblc892dMC8htQmavWEsCQox7en4jo9_pAAzdxU9Nr0n5skYk-A4gleA_i3A_mFC8P_Jo049YnkPWX74GPtxaW0pxLcbLy5-Fi8DpPJLQBV1Pgu0TK-8nS4SdcQxVfQWRUNAZWUC-ere1TSUcc1JadNQ",
    vectorHash: "4d9a...11ef",
    consensusRoot: "0x3bc7...a09d",
    attestationText: "5 Web Citations",
    metadataCountText: "2 verified matches found"
  },
  Sofia: {
    id: "Sofia",
    displayName: "Journalist Headshot",
    fileName: "Sofia_Chen_Investigative_ID.jpg",
    fileSize: "2.4 MB",
    dimensions: "1800x2400",
    statusText: "Ready for digital provenance audit & press registry verification.",
    thumbUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewg-jTfm7XFdZpKxrPHSdUaLfK6VEfID9ck0_bSefb7uV5aGm9qoGFsybNOwA8InSWj7XTayNXtZznp2hl6kuHiWH6S0uGItkMB3Rf8esUZbr-4Oq7bulon7qH9JtO2PlUqwNsxTjORktor3dNRDzQwSOtVuK7Bj0F3gawMui-KYobnGBJ25sSbQ5tYmM6Ieqstp0ZPHZizxGp9cRiQiPeVRmjJjJz7huFrP1ID6kzHL2CInCppzXog",
    scanUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewg-jTfm7XFdZpKxrPHSdUaLfK6VEfID9ck0_bSefb7uV5aGm9qoGFsybNOwA8InSWj7XTayNXtZznp2hl6kuHiWH6S0uGItkMB3Rf8esUZbr-4Oq7bulon7qH9JtO2PlUqwNsxTjORktor3dNRDzQwSOtVuK7Bj0F3gawMui-KYobnGBJ25sSbQ5tYmM6Ieqstp0ZPHZizxGp9cRiQiPeVRmjJjJz7huFrP1ID6kzHL2CInCppzXog",
    referenceUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewg-jTfm7XFdZpKxrPHSdUaLfK6VEfID9ck0_bSefb7uV5aGm9qoGFsybNOwA8InSWj7XTayNXtZznp2hl6kuHiWH6S0uGItkMB3Rf8esUZbr-4Oq7bulon7qH9JtO2PlUqwNsxTjORktor3dNRDzQwSOtVuK7Bj0F3gawMui-KYobnGBJ25sSbQ5tYmM6Ieqstp0ZPHZizxGp9cRiQiPeVRmjJjJz7huFrP1ID6kzHL2CInCppzXog",
    croppedRefUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewg-jTfm7XFdZpKxrPHSdUaLfK6VEfID9ck0_bSefb7uV5aGm9qoGFsybNOwA8InSWj7XTayNXtZznp2hl6kuHiWH6S0uGItkMB3Rf8esUZbr-4Oq7bulon7qH9JtO2PlUqwNsxTjORktor3dNRDzQwSOtVuK7Bj0F3gawMui-KYobnGBJ25sSbQ5tYmM6Ieqstp0ZPHZizxGp9cRiQiPeVRmjJjJz7huFrP1ID6kzHL2CInCppzXog",
    croppedMatchUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCewg-jTfm7XFdZpKxrPHSdUaLfK6VEfID9ck0_bSefb7uV5aGm9qoGFsybNOwA8InSWj7XTayNXtZznp2hl6kuHiWH6S0uGItkMB3Rf8esUZbr-4Oq7bulon7qH9JtO2PlUqwNsxTjORktor3dNRDzQwSOtVuK7Bj0F3gawMui-KYobnGBJ25sSbQ5tYmM6Ieqstp0ZPHZizxGp9cRiQiPeVRmjJjJz7huFrP1ID6kzHL2CInCppzXog",
    vectorHash: "8a1e...09d4",
    consensusRoot: "0x82ab...09f2",
    attestationText: "Press Syndicate ID",
    metadataCountText: "1 verified match found"
  }
};

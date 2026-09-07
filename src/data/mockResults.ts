import { SearchResult } from "../types/pipeline";

/**
 * Isolated visual search results mock data.
 * Structured cleanly to allow direct swapping with backend results later.
 */
export const mockResults: SearchResult[] = [
  {
    id: "res-01",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxlzbSvVBXr5t-QgWn_CeQjw5Jza4mn_q3uOT_O1MPwIr0LxoGglBeeBWf83hoQ7Ri-PZIgxPWDjmYdKp-VZQ4DR4m1zBypePUFTBosfmFCftZUDWR-GoTgbFmb1gYJQYYz47YyjF1oH5LV_9s7RMOGgNWriHk91gH7Vyu30wT9B3X6ursVcQx2q5H0f1rURHIlTjG-PACvcmL4SjyxQaD1BOe2Bu3klng7euRgCgl8SMOqOJgh1xUJg",
    source: "Newswire Global",
    type: "news", // matches "News article"
    title: "Consensus Leadership Panel Announcement",
    description: "Elena Rostova joins the global board alongside newly appointed systems engineers to discuss public attestation and ledger frameworks.",
    url: "https://newswire-global.net/press/consensus-leadership-panel",
    similarity: 0.924, // 92.4% -> Strong Match
    date: "Oct 14, 2024",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    block: "#6,940,112",
    signer: "Newswire Trust Authority #1"
  },
  {
    id: "res-02",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa_zT_ULe6ita0VY58MvugKz2PiLtVk9POcKU2YTuF7FxFbpGlev7vyK7ZmU2djwslLsojB8hTmLfmVrf9z2pzDfDny-ZwipsXAMU8n0T13AKtD0XTNUSJj0g58MDAVNAYlc7krcssoZUyX4Imuk-tnuE0uzPi-bxYdvu7QQJvRzaz_AsJ9b668etJZEnsWpq97wzLEP0TTbhootETFx106ZSB8wO3F8vlpY08C8gPS7_QtBVDoF34YA",
    source: "SocialIndex Feed",
    type: "social", // matches "Public social post"
    title: "Reframing Cryptographic Trust & Attestation Systems",
    description: "Attending the final sessions of the Consensus Forum today. Presenting our findings on secure decentralized key exchanges and biometric hashing.",
    url: "https://socialindex.com/posts/attestation-reframed",
    similarity: 0.871, // 87.1% -> Likely Match
    date: "Nov 02, 2024",
    sha256: "8c1d3f903a42b10998a4421be34d0928aa1192809fec9001bfa82910fae4483a",
    block: "#6,938,901",
    signer: "SocialIndex Verified Feed"
  },
  {
    id: "res-03",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6Gd4t50smzrufHQtObWoOSIONjeW0Tz2aLBZAgBx-xXWr59xmIGoCET-bwq15m1UGUQFfmi3Iyn_DNUDtmb04gFgmr3RSR7Wf34w83052uRPeZnlZjLY2s3saA4PGPcEoQvTlQqk_eigKBGt1TSMFPRH8z9QlrA9NrGiPyLeWD_DQRXeAtYZ13rvq91xnvLIIjW9UHZZMJ8Fw9lZRoAMxlbLhLYN94WnFgNyBTHCpE5qLCnWDSSS_SA",
    source: "Professional Directory",
    type: "other", // matches "Public profile"
    title: "Elena Rostova - Lead Systems Architect",
    description: "Experienced architecture professional specializing in distributed ledgers, zero-knowledge proofs, and secure digital signature infrastructure design.",
    url: "https://professionaldirectory.net/profiles/elena-rostova",
    similarity: 0.768, // 76.8% -> Possible Match
    date: "Aug 19, 2024",
    sha256: "91fae82110c9d744b10081cae40291fcdd019485bb21980004918ef930219481",
    block: "#6,921,440",
    signer: "Enterprise Identity Registry"
  },
  {
    id: "res-04",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4OBwqgwcvoHj98khaxzuI8yAlxreIhTdQZLI89_0EGufKcPDP79MScoLoDk6F79C4i9P6vayc8nrYAsPlrSZ8wxk7bAPRAu7TVJxh1BRkojgIDY08ubRWU973KmKypbVGrXn0Cy5ZCTcxmLu2lUHPq66Y0qB4JOo0f2m0Z7o8lNMO5ONJxdjHkcj-SVbgJr-A1DWxUromgLc0wQjmLRcsZ6HFECffjh3xaAOozxaMaICr9Ah11NpLkw",
    source: "WebArchive Registry",
    type: "other", // matches "Web page"
    title: "Consensus Conference Speaker Profile",
    description: "Speaker roster profile for Elena Rostova. Key topics include trust networks, cryptographic attestation, and data provenance mechanisms.",
    url: "https://webarchive-speaker.org/speakers/consensus-rostova",
    similarity: 0.683, // 68.3% -> Weak Match
    date: "Sep 04, 2024",
    sha256: "33b4119c8309100fae9291093849182390a8819ef39019284901924890192834",
    block: "#6,930,121",
    signer: "Archive Integrity Beacon"
  },
  {
    id: "res-05",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuheDT5twaEJ4Vy14j__WclawSJ1njyQTUIPKHLp13EtooonmfIwd5gdchmOseTsfJg7CN9-gwwkn-U6yH9-33GMFRz49vjRXlNwIyTQl0LWT6sJCGxLAXFLFkkt1U6lVQHetQtoIUXo7rcZRUefxC1CSoj_Ec0OS4ghzfmqNLSsURtwMdaMjE3KNcTeIBVcgEQeEM6JShb7czHvGERvmgruv4n4IzSk3Z4IeU5-U6mFYob7V0UExA0Lw",
    source: "VisualIndex Server",
    type: "other", // matches "Image result"
    title: "Portrait Frame attribution #2024",
    description: "Catalogued editorial capture. Stored with full visual signature for secure reverse search index mapping.",
    url: "https://visualindex.io/images/frame-attrib-2024",
    similarity: 0.617, // 61.7% -> Weak Match
    date: "Oct 21, 2024",
    sha256: "77a092dc01928301928491029384019238491029384019283401928340192834",
    block: "#6,929,881",
    signer: "Visual Attestation Authority"
  }
];

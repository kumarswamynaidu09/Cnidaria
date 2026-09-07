import { useState, useEffect, useCallback, useRef } from "react";
import { PipelineState, SearchResult, FaceDetails, BlockchainResponse, PipelineError } from "../types/pipeline";
import { PRESETS, PresetData } from "../data";
import { api } from "../services/api";
import { mockResults } from "../data/mockResults";

export interface AuditStepState {
  id: number;
  label: string;
  sublabel: string;
  status: "pending" | "running" | "completed" | "failed";
}

export const usePipeline = () => {
  const [state, setState] = useState<PipelineState>("idle");

  // Keep track of active timers to cleanly cancel them
  const activeTimersRef = useRef<NodeJS.Timeout[]>([]);

  const scheduleTimeout = useCallback((fn: () => void, delayMs: number) => {
    const id = setTimeout(fn, delayMs);
    activeTimersRef.current.push(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    activeTimersRef.current.forEach(clearTimeout);
    activeTimersRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);
  const [activePreset, setActivePreset] = useState<"Elena" | "Marcus" | "Sofia">("Elena");
  
  // Custom image upload variables
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string>("");
  const [customSize, setCustomSize] = useState<string>("");

  // Scan & Search States
  const [scanStep, setScanStep] = useState<number>(0); // 0 to 4
  const [scanStatusText, setScanStatusText] = useState<string>("");
  const [scanSubText, setScanSubText] = useState<string>("");
  const [scanBadgeText, setScanBadgeText] = useState<string>("");
  const [scanData, setScanData] = useState<FaceDetails | null>(null);

  const [searchStep, setSearchStep] = useState<number>(0); // 0 to 4
  const [searchStatusText, setSearchStatusText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  // Drawer / Inspector Panel
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  
  // Blockchain Audit Sequence
  const [simulateTampering, setSimulateTampering] = useState<boolean>(false);
  const [auditSteps, setAuditSteps] = useState<AuditStepState[]>([
    { id: 1, label: "Downloading content", sublabel: "Fetching raw byte payload from origin server", status: "pending" },
    { id: 2, label: "Calculating fingerprint", sublabel: "Executing local SHA-256 byte digest", status: "pending" },
    { id: 3, label: "Comparing with blockchain record", sublabel: "Querying Sepolia contract registry", status: "pending" }
  ]);
  const [blockchainResult, setBlockchainResult] = useState<BlockchainResponse | null>(null);

  // Error State
  const [error, setError] = useState<PipelineError | null>(null);

  // Current active asset metadata helper
  const getActiveAsset = useCallback(() => {
    if (customImage) {
      return {
        displayName: customName || "Uploaded Image",
        fileName: customName || "reference.jpg",
        fileSize: customSize || "Unknown size",
        dimensions: "N/A",
        statusText: "Ready for spatial feature embedding.",
        thumbUrl: customImage,
        scanUrl: customImage,
        referenceUrl: customImage,
        croppedRefUrl: customImage,
        croppedMatchUrl: customImage,
        vectorHash: "custom_hash_9f2c",
        consensusRoot: "0x82ab...91cd",
        attestationText: "Custom User Reference",
        metadataCountText: "Search result candidates pending"
      };
    }
    return PRESETS[activePreset];
  }, [activePreset, customImage, customName, customSize]);

  // Handle Preset Clicks
  const selectPreset = (preset: "Elena" | "Marcus" | "Sofia") => {
    setCustomImage(null);
    setActivePreset(preset);
    setState("image_selected");
  };

  // Handle Local Uploads
  const selectCustomImage = (dataUrl: string, name: string, sizeBytes: number) => {
    setCustomImage(dataUrl);
    setCustomName(name);
    // Format human-readable size
    const mb = sizeBytes / (1024 * 1024);
    const sizeStr = mb > 1 ? `${mb.toFixed(1)} MB` : `${(sizeBytes / 1024).toFixed(0)} KB`;
    setCustomSize(sizeStr);
    
    // Validate file type
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const supported = ["jpg", "jpeg", "png", "webp"];
    if (!supported.includes(ext)) {
      setError({
        type: "invalid_image",
        message: "Unsupported file format.",
        suggestion: "Please upload a clearly readable JPG, JPEG, PNG, or WEBP photo."
      });
      setState("error");
      return;
    }

    setError(null);
    setState("image_selected");
  };

  // Reset function
  const resetViewfinder = () => {
    clearAllTimers();
    setState("idle");
    setCustomImage(null);
    setCustomName("");
    setCustomSize("");
    setSelectedResult(null);
    setIsDrawerOpen(false);
    setIsAuditModalOpen(false);
    setError(null);
  };

  // Run the visual analysis flow sequentially (Section 2 & 14 Timeline)
  const startVisualSearchFlow = () => {
    // Clear any previously running flows
    clearAllTimers();
    setError(null);

    // 1. Scanning State - Analyzing Image
    setState("scanning");
    setScanStep(1);
    setScanStatusText("Analyzing image");
    setScanSubText("Normalizing density structures and parsing pixel color matrices.");
    setScanBadgeText("Analyzing pixels");
    
    scheduleTimeout(() => {
      // 2. Scanning State - Detecting Face
      setScanStep(2);
      setScanStatusText("Detecting face");
      setScanSubText("Locating visual region anchors and face landmark geometries.");
      setScanBadgeText("Detecting face");
      
      scheduleTimeout(() => {
        // 3. Face Detected State Transition
        setState("face_detected");
        setScanStep(3);
        setScanStatusText("Face detected");
        setScanSubText("Identified facial landmarks. Locking coordinates.");
        setScanBadgeText("Face detected ✓");
        
        scheduleTimeout(() => {
          // 4. Face Encoding State Transition
          setState("face_encoding");
          setScanStep(4);
          setScanStatusText("Generating visual signature");
          setScanSubText("Mapping multi-dimensional vector matrices based on landmarks.");
          setScanBadgeText("Generating signature");
          
          scheduleTimeout(() => {
            setScanStatusText("Encoding face");
            setScanSubText("Finalizing visual signature projection. Key points locked.");
            setScanBadgeText("Encoding face");
            
            scheduleTimeout(() => {
              // 5. Face Encoded State Transition (Pipeline automatically moves to web search after a brief hold)
              setState("face_encoded");
              setScanStep(5);
              setScanStatusText("Face encoded");
              setScanSubText("Simulated visual attribution signature generated successfully.");
              setScanBadgeText("Face encoded ✓");
              
              // Delay 1500ms, then automatically transition to Web Search state
              scheduleTimeout(() => {
                runWebSearchSequence();
              }, 1500);
            }, 1200);
          }, 1200);
        }, 1500);
      }, 1200);
    }, 1000);
  };

  // Web Search Sequence (Task 3)
  const runWebSearchSequence = () => {
    setState("searching");
    setSearchStep(1);
    setSearchStatusText("Searching public sources");

    // 1. Searching public sources -> 2. Finding visual matches (1500ms)
    scheduleTimeout(() => {
      setSearchStep(2);
      setSearchStatusText("Finding visual matches");

      // 2. Finding visual matches -> 3. Comparing visual features (1500ms)
      scheduleTimeout(() => {
        setSearchStep(3);
        setSearchStatusText("Comparing visual features");

        // 3. Comparing visual features -> 4. Comparing faces (1500ms)
        scheduleTimeout(() => {
          setSearchStep(4);
          setSearchStatusText("Comparing faces");

          // 4. Comparing faces -> 5. Ranking candidates (1500ms)
          scheduleTimeout(() => {
            setSearchStep(5);
            setSearchStatusText("Ranking candidates");

            // 5. Ranking candidates -> 6. Search complete (1500ms)
            scheduleTimeout(() => {
              setSearchStep(6);
              setSearchStatusText("Search complete");

              // Map deterministic search results to make sure both frontend formats work flawlessly
              const deterministicResults = mockResults.map(item => ({
                ...item,
                image: item.imageUrl,
                sourceType: item.type,
                caption: item.description,
                similarityScore: item.similarity
              }));
              setSearchResults(deterministicResults);
              setState("search_complete");

              // 7. Transition to results state after a brief hold (1500ms)
              scheduleTimeout(() => {
                setState("results");
              }, 1500);

            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  // Inspect specific card/result details
  const inspectResult = (result: SearchResult) => {
    setSelectedResult(result);
    setState("result_selected");
    setIsDrawerOpen(true);
  };

  // Perform Blockchain Verification (Section 7, 8, 9 & 14 Timeline)
  const runProvenanceAudit = async () => {
    if (!selectedResult) return;
    
    setIsAuditModalOpen(true);
    setBlockchainResult(null);

    // Reset steps
    setAuditSteps([
      { id: 1, label: "Downloading content", sublabel: "Fetching raw byte payload from origin server", status: "running" },
      { id: 2, label: "Calculating fingerprint", sublabel: "Executing local SHA-256 byte digest", status: "pending" },
      { id: 3, label: "Comparing with blockchain record", sublabel: "Querying Sepolia contract registry", status: "pending" }
    ]);

    try {
      // Step 1: Downloading (1200ms)
      await new Promise(resolve => setTimeout(resolve, 1200));
      setAuditSteps(prev => prev.map(s => s.id === 1 ? { ...s, status: "completed" } : s.id === 2 ? { ...s, status: "running" } : s));

      // Step 2: Hashing (1100ms)
      await new Promise(resolve => setTimeout(resolve, 1100));
      setAuditSteps(prev => prev.map(s => s.id === 2 ? { ...s, status: "completed" } : s.id === 3 ? { ...s, status: "running" } : s));

      // Fetch verified payload
      const response = await api.verifyBlockchain(
        selectedResult.id,
        customImage ? "Elena" : activePreset,
        simulateTampering
      );

      // Step 3: Ledger lookup (1100ms)
      await new Promise(resolve => setTimeout(resolve, 1100));
      setAuditSteps(prev => prev.map(s => s.id === 3 ? { ...s, status: response.verified ? "completed" : "failed" } : s));

      setBlockchainResult(response);
      setState("verified");

    } catch (err: any) {
      setAuditSteps(prev => prev.map(s => s.status === "running" ? { ...s, status: "failed" } : s));
      setError({
        type: "verification_failed",
        message: "Provenance smart-contract audit failed.",
        suggestion: "The target node was unreachable or transaction index is corrupted."
      });
      setState("error");
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (state === "result_selected") {
      setState("results");
    }
  };

  const backToMatches = () => {
    setSelectedResult(null);
    setState("results");
    setIsDrawerOpen(false);
  };

  const closeAuditModal = () => {
    setIsAuditModalOpen(false);
  };

  return {
    state,
    setState,
    activePreset,
    selectPreset,
    customImage,
    customName,
    customSize,
    selectCustomImage,
    resetViewfinder,
    startVisualSearchFlow,

    // Scanning Details
    scanStep,
    scanStatusText,
    scanSubText,
    scanBadgeText,
    scanData,

    // Search Details
    searchStep,
    searchStatusText,
    searchResults,
    selectedResult,
    inspectResult,
    backToMatches,

    // Provenance Drawer & Verification
    isDrawerOpen,
    closeDrawer,
    isAuditModalOpen,
    closeAuditModal,
    simulateTampering,
    setSimulateTampering,
    auditSteps,
    blockchainResult,
    runProvenanceAudit,

    // Errors
    error,
    getActiveAsset
  };
};

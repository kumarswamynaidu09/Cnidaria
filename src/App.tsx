import { Header } from "./components/Header";
import { UploadView } from "./components/UploadView";
import { ScanningView } from "./components/ScanningView";
import { CrawlingView } from "./components/CrawlingView";
import { ResultsView } from "./components/ResultsView";
import { MatchDetailView } from "./components/MatchDetailView";
import { ProvenanceDrawer } from "./components/ProvenanceDrawer";
import { AuditModal } from "./components/AuditModal";
import { ErrorView } from "./components/ErrorView";
import { Footer } from "./components/Footer";
import { usePipeline } from "./hooks/usePipeline";
import { PRESETS } from "./data";

export default function App() {
  const {
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
  } = usePipeline();

  const activeAsset = getActiveAsset();

  // Dynamic overrides: If the user uploads a custom file, we dynamically override 
  // the first search result's image to show the uploaded photo for a fully integrated demo
  const finalSearchResults = searchResults.map((res, index) => {
    if (customImage && index === 0) {
      return {
        ...res,
        imageUrl: customImage,
        title: `Visual Attribution: ${customName}`
      };
    }
    return res;
  });

  const finalSelectedResult = selectedResult 
    ? (customImage && selectedResult.id === finalSearchResults[0]?.id)
      ? { ...selectedResult, imageUrl: customImage, title: `Visual Attribution: ${customName}` }
      : selectedResult
    : null;

  // Handle stage skips for the mock sequence gracefully
  const handleJumpToStage = (stageNum: number) => {
    closeDrawer();
    closeAuditModal();

    if (stageNum === 1) {
      setState(customImage ? "image_selected" : "idle");
    } else if (stageNum === 2) {
      setState("scanning");
      startVisualSearchFlow();
    } else if (stageNum === 3) {
      setState("searching");
    } else if (stageNum === 4) {
      setState("results");
    }
  };

  return (
    <div className="bg-[#0E0E2C] text-[#F8F5F2] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-[#FF3F7F]/30 relative overflow-hidden">
      
      {/* Subtle Marine Background Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,111,145,0.03)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(184,169,232,0.03)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,63,127,0.015)_0%,transparent_60%)] pointer-events-none"></div>

      {/* Top Application Bar */}
      <Header onReset={resetViewfinder} />

      {/* Main Workspace Viewport */}
      <main className="flex-1 w-full max-w-container-max mx-auto px-gutter-desktop py-12 relative z-10">
        {state === "error" ? (
          <ErrorView error={error} onReset={resetViewfinder} />
        ) : state === "idle" || state === "image_selected" ? (
          <UploadView
            activePreset={activePreset}
            customImage={customImage}
            customName={customName}
            customSize={customSize}
            onImageUpload={selectCustomImage}
            onPresetSelect={selectPreset}
            onStartSearch={startVisualSearchFlow}
          />
        ) : ["scanning", "face_detected", "face_encoding", "face_encoded"].includes(state) ? (
          <ScanningView
            imageUrl={activeAsset.scanUrl}
            state={state}
            scanStep={scanStep}
            statusText={scanStatusText}
            subText={scanSubText}
            badgeText={scanBadgeText}
            onReset={resetViewfinder}
            onRestart={startVisualSearchFlow}
          />
        ) : ["searching", "search_complete"].includes(state) ? (
          <CrawlingView
            referenceUrl={activeAsset.referenceUrl}
            searchStep={state === "search_complete" ? 6 : searchStep}
            statusText={searchStatusText}
            vectorHash={activeAsset.vectorHash}
            onReset={resetViewfinder}
            onRestart={startVisualSearchFlow}
          />
        ) : ["result_selected", "verifying"].includes(state) ? (
          <MatchDetailView
            selectedResult={finalSelectedResult}
            referenceUrl={activeAsset.thumbUrl}
            onBack={backToMatches}
            onVerify={() => setState("verifying")}
            isVerifying={state === "verifying"}
          />
        ) : (
          /* Results Stage */
          <ResultsView
            results={finalSearchResults.length > 0 ? finalSearchResults : (PRESETS[activePreset] ? [] : [])}
            referenceThumb={activeAsset.thumbUrl}
            onBack={resetViewfinder}
            onInspectResult={inspectResult}
            selectedResult={finalSelectedResult}
          />
        )}
      </main>

      {/* Slide-out Drawer Panel */}
      <ProvenanceDrawer
        isOpen={isDrawerOpen}
        result={finalSelectedResult}
        onClose={closeDrawer}
        onVerify={runProvenanceAudit}
        simulateTampering={simulateTampering}
        setSimulateTampering={setSimulateTampering}
        activePresetCropRef={activeAsset.croppedRefUrl}
      />

      {/* Integrity Audit Modal Dialog */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={closeAuditModal}
        steps={auditSteps}
        result={blockchainResult}
        selectedResult={finalSelectedResult}
        simulateTampering={simulateTampering}
      />

      {/* Global Application Footer */}
      <Footer />
    </div>
  );
}

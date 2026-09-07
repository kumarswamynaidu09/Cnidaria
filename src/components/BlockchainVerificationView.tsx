import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SearchResult } from "../types/pipeline";
import { mockBlockchainVerification, tamperedFingerprint } from "../data/mockBlockchain";

interface BlockchainVerificationViewProps {
  selectedResult: SearchResult;
  onBackToMatch: () => void;
  onBackToMatches: () => void;
}

type StepState = "preparing" | "hashing" | "checking_blockchain" | "comparing" | "verified";

export const BlockchainVerificationView: React.FC<BlockchainVerificationViewProps> = ({
  selectedResult,
  onBackToMatch,
  onBackToMatches
}) => {
  const [currentStep, setCurrentStep] = useState<StepState>("preparing");
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [copiedCurrent, setCopiedCurrent] = useState<boolean>(false);
  const [copiedRegistered, setCopiedRegistered] = useState<boolean>(false);

  // Auto-progression sequence with precise, pleasant duration delays
  useEffect(() => {
    if (currentStep === "verified") return;

    let timerId: NodeJS.Timeout;

    if (currentStep === "preparing") {
      timerId = setTimeout(() => {
        setCurrentStep("hashing");
      }, 1300);
    } else if (currentStep === "hashing") {
      timerId = setTimeout(() => {
        setCurrentStep("checking_blockchain");
      }, 1300);
    } else if (currentStep === "checking_blockchain") {
      timerId = setTimeout(() => {
        setCurrentStep("comparing");
      }, 1400);
    } else if (currentStep === "comparing") {
      timerId = setTimeout(() => {
        setCurrentStep("verified");
      }, 1400);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [currentStep]);

  // Handle Clipboard Copy helper
  const handleCopy = (text: string, type: "current" | "registered") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "current") {
        setCopiedCurrent(true);
        setTimeout(() => setCopiedCurrent(false), 2000);
      } else {
        setCopiedRegistered(true);
        setTimeout(() => setCopiedRegistered(false), 2000);
      }
    });
  };

  const currentFingerprint = isTampered
    ? tamperedFingerprint
    : mockBlockchainVerification.currentFingerprint;

  const registeredFingerprint = mockBlockchainVerification.registeredFingerprint;

  // Timeline step helper configuration
  const timelineSteps = [
    { key: "preparing", label: "Content prepared", description: "Source assets parsed and verified." },
    { key: "hashing", label: "SHA-256 fingerprint generated", description: "Cryptographic hash generated successfully." },
    { key: "checking_blockchain", label: "Blockchain record found", description: "Querying distributed attestation registry." },
    { key: "comparing", label: "Fingerprints compared", description: "Verifying current payload with registered block." },
    { key: "verified", label: "Provenance verified", description: "Integrity confirmation complete." }
  ];

  const getStepStatus = (stepKey: string) => {
    const keys: StepState[] = ["preparing", "hashing", "checking_blockchain", "comparing", "verified"];
    const currentIndex = keys.indexOf(currentStep);
    const stepIndex = keys.indexOf(stepKey as StepState);

    if (stepKey === "verified" && currentStep === "verified") {
      return isTampered ? "failed" : "completed";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8 select-none"
      id="blockchain-verification-view"
    >
      {/* HEADER NAVIGATION PANELS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMatch}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-deep-violet/30 hover:bg-deep-violet/75 border border-hot-pink/10 hover:border-hot-pink/25 text-lavender hover:text-off-white text-xs font-semibold transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <span>Back to match</span>
          </button>
          
          <button
            onClick={onBackToMatches}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-deep-violet/10 hover:bg-deep-violet/40 border border-white/5 hover:border-white/10 text-lavender/80 hover:text-off-white text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            <span>Back to matches</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-right">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[10px] text-lavender/60 uppercase tracking-widest">
            {mockBlockchainVerification.network}
          </span>
        </div>
      </div>

      {/* SELECTED RESULT QUICK SUMMARY SUMMARY BANNER */}
      <div className="bg-midnight-indigo rounded-2xl p-4 md:p-5 border border-hot-pink/10 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-15 rounded-lg overflow-hidden bg-deep-midnight shrink-0 border border-white/10">
            <img
              src={selectedResult.image || selectedResult.imageUrl}
              alt={selectedResult.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-hot-pink font-semibold">
              Selected Match Source
            </span>
            <h4 className="text-sm font-sans font-bold text-off-white truncate mt-0.5">
              {selectedResult.title}
            </h4>
            <p className="text-xs text-lavender/70 truncate font-sans">
              Verified node citation: <span className="font-semibold text-off-white">{selectedResult.source}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
          <div className="text-left md:text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-lavender/50 block">
              Similarity Match
            </span>
            <span className="text-sm font-sans font-bold text-off-white">
              {selectedResult.similarityScore || (selectedResult.similarity * 100).toFixed(1)}% Score
            </span>
          </div>
          <div className="h-8 w-px bg-white/5 hidden md:block"></div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-lavender/50 block">
              Classification
            </span>
            <span className="text-xs font-sans font-bold text-hot-pink">
              Visual Correlation Match
            </span>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: WORKSPACE & CHRONOLOGICAL TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE WORKSPACE CONSOLE */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            
            {/* 1. PREPARING STATE WORKSPACE */}
            {currentStep === "preparing" && (
              <motion.div
                key="preparing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-midnight-indigo rounded-3xl p-6 md:p-8 border border-hot-pink/15 shadow-[0_0_24px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center min-h-[360px]"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border border-hot-pink/10 flex items-center justify-center bg-deep-violet">
                    <span className="material-symbols-outlined text-[32px] text-hot-pink animate-pulse">
                      inventory_2
                    </span>
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hot-pink opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-hot-pink"></span>
                  </span>
                </div>
                <h3 className="font-sans text-xl font-bold text-off-white mb-2">
                  Preparing provenance verification
                </h3>
                <p className="font-sans text-sm text-lavender max-w-md leading-relaxed">
                  Preparing the selected source for fingerprint verification. Parsing distributed payload registers and indexing visual reference parameters.
                </p>
                <div className="mt-8 flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-bounce delay-200"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-bounce delay-300"></span>
                </div>
              </motion.div>
            )}

            {/* 2. HASHING STATE WORKSPACE */}
            {currentStep === "hashing" && (
              <motion.div
                key="hashing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-midnight-indigo rounded-3xl p-6 md:p-8 border border-hot-pink/15 shadow-[0_0_24px_rgba(0,0,0,0.15)] flex flex-col justify-between min-h-[360px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <span className="font-mono text-[10px] text-hot-pink uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-ping"></span>
                      Local digest engine
                    </span>
                    <span className="font-mono text-[10px] text-lavender/60">SHA-256 calculator</span>
                  </div>

                  <h3 className="font-sans text-xl font-bold text-off-white mb-2">
                    Calculating SHA-256 fingerprint
                  </h3>
                  <p className="font-sans text-sm text-lavender leading-relaxed max-w-lg mb-6">
                    Generating a unique cryptographic signature from the matched content payload. Visual nodes are being normalized to enforce strict structural attestation mapping.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-[10px] text-lavender/70">
                    <span>Hashing progress</span>
                    <span>Running node evaluation...</span>
                  </div>
                  <div className="h-1.5 w-full bg-deep-violet rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.3, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-hot-pink to-coral"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CHECKING BLOCKCHAIN RECORD WORKSPACE */}
            {currentStep === "checking_blockchain" && (
              <motion.div
                key="checking_blockchain"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-midnight-indigo rounded-3xl p-6 md:p-8 border border-hot-pink/15 shadow-[0_0_24px_rgba(0,0,0,0.15)] flex flex-col justify-between min-h-[360px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <span className="font-mono text-[10px] text-hot-pink uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-ping"></span>
                      Attestation ledger lookup
                    </span>
                    <span className="font-mono text-[10px] text-lavender/60">Network Query</span>
                  </div>

                  <h3 className="font-sans text-xl font-bold text-off-white mb-2">
                    Checking blockchain record
                  </h3>
                  <p className="font-sans text-sm text-lavender leading-relaxed max-w-lg mb-6">
                    Looking for a registered provenance fingerprint on the distributed consensus registry network index.
                  </p>
                </div>

                {/* Elegant, minimal visualization of lookup flow */}
                <div className="bg-deep-midnight/50 rounded-2xl p-4 border border-white/5 flex items-center justify-around gap-2 text-center py-6">
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-[10px] font-bold text-lavender/50 uppercase tracking-wider">Content</span>
                    <span className="material-symbols-outlined text-lg text-lavender mt-1.5">image</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-hot-pink/40 animate-pulse">arrow_forward</span>
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-[10px] font-bold text-lavender/50 uppercase tracking-wider">SHA-256</span>
                    <span className="font-mono text-[10px] text-hot-pink bg-deep-violet/80 px-2 py-0.5 rounded mt-1.5 border border-hot-pink/10">7f83b1...</span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-hot-pink/40 animate-pulse">arrow_forward</span>
                  <div className="flex flex-col items-center">
                    <span className="font-sans text-[10px] font-bold text-lavender/50 uppercase tracking-wider">Attestation Block</span>
                    <div className="flex items-center gap-1 text-emerald-400 mt-1.5">
                      <span className="material-symbols-outlined text-base">hub</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. COMPARING STATE WORKSPACE */}
            {currentStep === "comparing" && (
              <motion.div
                key="comparing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-midnight-indigo rounded-3xl p-6 md:p-8 border border-hot-pink/15 shadow-[0_0_24px_rgba(0,0,0,0.15)] flex flex-col justify-between min-h-[360px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <span className="font-mono text-[10px] text-hot-pink uppercase tracking-widest font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-ping"></span>
                      Attestation compare validation
                    </span>
                    <span className="font-mono text-[10px] text-lavender/60">Binary signature validation</span>
                  </div>

                  <h3 className="font-sans text-xl font-bold text-off-white mb-2">
                    Comparing fingerprints
                  </h3>
                  <p className="font-sans text-sm text-lavender leading-relaxed max-w-lg mb-6">
                    Comparing the current content fingerprint with the registered cryptographic record stored on-chain.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Mock fingerprint displays during comparison stage */}
                  <div className="space-y-1">
                    <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-lavender/40">Current Fingerprint</span>
                    <div className="font-mono text-[11px] text-off-white bg-deep-midnight p-2.5 rounded-xl border border-white/5 break-all leading-normal select-text">
                      {currentFingerprint}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-lavender/40">Registered Fingerprint</span>
                    <div className="font-mono text-[11px] text-off-white/70 bg-deep-midnight p-2.5 rounded-xl border border-white/5 break-all leading-normal select-text">
                      {registeredFingerprint}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. VERIFIED / TAMPERED (COMPLETED) STATE WORKSPACE */}
            {currentStep === "verified" && (
              <motion.div
                key="completed_state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Visual state card */}
                <div className="bg-midnight-indigo rounded-3xl p-6 md:p-8 border border-hot-pink/15 shadow-[0_0_24px_rgba(0,0,0,0.15)] flex flex-col justify-between min-h-[360px]">
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                      <span className="font-mono text-[10px] text-hot-pink uppercase tracking-widest font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-pulse"></span>
                        Decentralized attestation complete
                      </span>
                      <span className="font-mono text-[10px] text-lavender/60">Registry verification report</span>
                    </div>

                    {/* Result details: Verified or Tampered */}
                    {!isTampered ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-1">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <span className="material-symbols-outlined text-[28px]">verified_user</span>
                          </div>
                          <div>
                            <h3 className="font-sans text-xl font-bold text-off-white">
                              Provenance verified
                            </h3>
                            <p className="font-sans text-xs text-lavender">
                              The content fingerprint matches the registered blockchain record exactly.
                            </p>
                          </div>
                        </div>
                        <p className="font-sans text-xs text-lavender/80 leading-relaxed max-w-lg mb-4">
                          Secure distributed record confirmation complete. This ensures the asset under test aligns with the historical state logged inside the local ledger index on <span className="font-bold text-off-white">September 7, 2026</span>.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-1">
                          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <span className="material-symbols-outlined text-[28px]">gpp_maybe</span>
                          </div>
                          <div>
                            <h3 className="font-sans text-xl font-bold text-off-white">
                              Verification failed
                            </h3>
                            <p className="font-sans text-xs text-rose-400 font-semibold">
                              Current fingerprint mismatch detected.
                            </p>
                          </div>
                        </div>
                        <p className="font-sans text-xs text-lavender/80 leading-relaxed max-w-lg mb-4">
                          The current content fingerprint does not match the registered blockchain record. The visual signature has been structurally tampered with or modified.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Fingerprint Side-By-Side Comparison Panels */}
                  <div className="space-y-4 my-4">
                    {/* CURRENT FINGERPRINT BOX */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-lavender/50">Current Fingerprint</span>
                        <div className="flex items-center gap-1.5">
                          {copiedCurrent && (
                            <span className="text-[9px] font-sans text-emerald-400 font-semibold">Copied!</span>
                          )}
                          <button
                            onClick={() => handleCopy(currentFingerprint, "current")}
                            className="text-lavender/40 hover:text-off-white hover:bg-white/5 p-1 rounded transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">content_copy</span>
                          </button>
                        </div>
                      </div>
                      <div className={`font-mono text-[11px] bg-deep-midnight p-3 rounded-xl border transition-all duration-300 break-all leading-normal select-text ${
                        isTampered ? "border-rose-500/30 text-rose-300" : "border-emerald-500/30 text-emerald-300"
                      }`}>
                        {currentFingerprint}
                      </div>
                    </div>

                    {/* REGISTERED FINGERPRINT BOX */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-lavender/50">Registered Fingerprint</span>
                        <div className="flex items-center gap-1.5">
                          {copiedRegistered && (
                            <span className="text-[9px] font-sans text-emerald-400 font-semibold">Copied!</span>
                          )}
                          <button
                            onClick={() => handleCopy(registeredFingerprint, "registered")}
                            className="text-lavender/40 hover:text-off-white hover:bg-white/5 p-1 rounded transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">content_copy</span>
                          </button>
                        </div>
                      </div>
                      <div className="font-mono text-[11px] text-off-white/80 bg-deep-midnight p-3 rounded-xl border border-emerald-500/30 break-all leading-normal select-text">
                        {registeredFingerprint}
                      </div>
                    </div>
                  </div>

                  {/* Blockchain metadata table summary layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-4 text-left select-none">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-lavender/50 block">Status</span>
                      <span className={`text-xs font-sans font-bold ${
                        isTampered ? "text-rose-400" : "text-emerald-400"
                      }`}>
                        {isTampered ? "Fingerprint mismatch" : "Exact match"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-lavender/50 block">Registered date</span>
                      <span className="text-xs font-sans font-bold text-off-white">
                        Sept 7, 2026
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-lavender/50 block">Transaction hash</span>
                      <span className="text-xs font-mono text-lavender hover:text-off-white font-medium truncate block max-w-[120px]" title={mockBlockchainVerification.transactionHash}>
                        {mockBlockchainVerification.transactionHash.slice(0, 10)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-lavender/50 block">Attestation node</span>
                      <span className="text-xs font-sans font-bold text-off-white">
                        Cnidaria Local Network
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated tamper detection controls box */}
                <div className="bg-deep-midnight/35 p-5 rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-hot-pink block">
                      Tamper proof evaluation demo
                    </span>
                    <p className="text-xs text-lavender leading-relaxed mt-1 max-w-sm">
                      Demonstrate why distributed attestation hashes matter by simulating visual alteration.
                    </p>
                  </div>

                  {!isTampered ? (
                    <button
                      onClick={() => setIsTampered(true)}
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-300 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[15px]">dangerous</span>
                      <span>Simulate tampering</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTampered(false)}
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 animate-pulse"
                    >
                      <span className="material-symbols-outlined text-[15px]">history</span>
                      <span>Restore original</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: CHRONOLOGICAL VERIFICATION TIMELINE */}
        <div className="lg:col-span-5 bg-midnight-indigo rounded-3xl p-6 border border-white/5 shadow-inner select-none space-y-6">
          <div>
            <h4 className="font-sans text-sm font-bold text-off-white tracking-wide">
              Verification audit timeline
            </h4>
            <p className="font-sans text-xs text-lavender mt-0.5">
              Live updates as attestation pipeline runs.
            </p>
          </div>

          <div className="relative pl-1.5 space-y-6">
            {/* Timeline vertical stem */}
            <div className="absolute left-[13px] top-2 bottom-2 w-px bg-white/5"></div>

            {timelineSteps.map((step) => {
              const status = getStepStatus(step.key);
              const isCompleted = status === "completed";
              const isActive = status === "active";
              const isFailed = status === "failed";

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {/* Step visual indicator */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    isCompleted
                      ? "bg-hot-pink text-deep-midnight"
                      : isFailed
                        ? "bg-rose-500 text-deep-midnight font-bold animate-pulse"
                        : isActive
                          ? "bg-deep-violet border border-hot-pink text-hot-pink animate-pulse shadow-[0_0_8px_rgba(255,111,145,0.2)]"
                          : "bg-deep-midnight border border-white/5 text-lavender/40"
                  }`}>
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    ) : isFailed ? (
                      <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                    ) : isActive ? (
                      <span className="font-mono text-[9px] font-bold">●</span>
                    ) : (
                      <span className="font-mono text-[9px] font-bold">○</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <p className={`font-sans text-xs font-semibold leading-tight ${
                      isCompleted ? "text-off-white" : isActive ? "text-hot-pink font-bold" : isFailed ? "text-rose-400 font-bold" : "text-lavender/50"
                    }`}>
                      {step.label}
                    </p>
                    <p className={`font-sans text-[11px] leading-relaxed mt-0.5 ${
                      isActive || isCompleted || isFailed ? "text-lavender/80" : "text-lavender/30"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

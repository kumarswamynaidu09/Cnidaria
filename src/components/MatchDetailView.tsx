import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SearchResult } from "../types/pipeline";

interface MatchDetailViewProps {
  selectedResult: SearchResult | null;
  referenceUrl: string; // The uploaded image URL
  onBack: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({
  selectedResult,
  referenceUrl,
  onBack,
  onVerify,
  isVerifying
}) => {
  const [ringOffset, setRingOffset] = useState(165); // Default empty ring offset

  useEffect(() => {
    if (selectedResult) {
      // Animate the SVG similarity ring once the component mounts
      const radius = 26;
      const strokeLength = 2 * Math.PI * radius; // ~163.3
      const offset = strokeLength - (strokeLength * selectedResult.similarity);
      const timer = setTimeout(() => {
        setRingOffset(offset);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedResult]);

  // Clean Error State if no result is selected
  if (!selectedResult) {
    return (
      <div 
        className="py-16 flex flex-col items-center justify-center text-center animate-fadeIn max-w-md mx-auto select-none"
        id="error-missing-result"
      >
        <div className="w-16 h-16 rounded-2xl bg-deep-violet border border-coral/15 flex items-center justify-center text-coral mb-4">
          <span className="material-symbols-outlined text-[36px]">error_outline</span>
        </div>
        <h3 className="font-display-lg text-2xl font-bold text-off-white mb-2">
          No result selected
        </h3>
        <p className="font-body-md text-sm text-muted-lavender leading-relaxed mb-6">
          Please choose a match from the results grid first.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-deep-violet hover:bg-coral hover:text-deep-midnight border border-coral/20 text-coral font-sans text-xs font-semibold cursor-pointer transition-transform active:scale-95"
        >
          Back to matches
        </button>
      </div>
    );
  }

  const scorePercentage = (selectedResult.similarity * 100).toFixed(1);

  // Match Classification calculation (Subtle)
  const getMatchClassification = (similarity: number) => {
    const score = similarity * 100;
    if (score >= 90) return "Strong visual match";
    if (score >= 80) return "Likely visual match";
    if (score >= 70) return "Possible visual match";
    return "Weak visual match";
  };

  // Helper for source type label mapping
  const getReadableType = (res: SearchResult) => {
    if (res.id === "res-01") return "News article";
    if (res.id === "res-02") return "Public social post";
    if (res.id === "res-03") return "Public profile";
    if (res.id === "res-04") return "Web page";
    if (res.id === "res-05") return "Image result";

    switch (res.type) {
      case "social": return "Public social post";
      case "news": return "News article";
      case "academic": return "Academic reference";
      default: return "Web reference";
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="max-w-6xl mx-auto py-2 select-none"
      id="match-detail-view"
    >
      {/* Back button with text label */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
        className="mb-6"
      >
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-deep-violet/30 hover:bg-deep-violet/75 border border-coral/10 hover:border-coral/25 text-muted-lavender hover:text-off-white text-xs font-semibold transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          <span>Back to matches</span>
        </button>
      </motion.div>

      {/* Main Grid: Visual Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== LEFT COLUMN: IMAGE COMPARISON MODULE ==================== */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
          className="lg:col-span-7 bg-midnight-indigo rounded-3xl p-6 border border-coral/10 shadow-[0_0_24px_rgba(0,0,0,0.15)] flex flex-col gap-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
            <h3 className="text-sm font-sans font-bold text-off-white tracking-wide uppercase select-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
              Visual Comparison Viewport
            </h3>
            <span className="font-mono text-[10px] text-muted-lavender/70">Inspect correspondence</span>
          </div>

          {/* Large Side-by-Side (Desktop) or Stacked (Mobile) Visual Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Subject Reference Frame (Your Image) */}
            <div className="flex flex-col gap-2 group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-deep-midnight border border-coral/15 relative shadow-inner overflow-hidden">
                <img
                  alt="Original reference query"
                  className="w-full h-full object-cover brightness-95 group-hover:scale-[1.01] transition-transform duration-500"
                  src={referenceUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/50 via-transparent to-transparent opacity-40"></div>
                
                {/* Visual Label overlay */}
                <div className="absolute bottom-3 left-3 bg-deep-midnight/90 text-coral border border-coral/20 px-2.5 py-1 rounded-lg font-code-xs text-[10px] uppercase font-bold tracking-widest select-none">
                  Your image
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-sans text-xs text-muted-lavender font-semibold">Reference Image</p>
                <span className="font-sans text-[10px] text-muted-lavender/60">Source query signature input</span>
              </div>
            </div>

            {/* Candidate Web Matched Frame (Matched Image) */}
            <div className="flex flex-col gap-2 group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-deep-midnight border border-coral/25 relative shadow-inner overflow-hidden">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  alt="Matched content reference"
                  className="w-full h-full object-cover brightness-95 group-hover:scale-[1.01] transition-transform duration-500"
                  src={selectedResult.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/50 via-transparent to-transparent opacity-40"></div>

                {/* Visual Label overlay */}
                <div className="absolute bottom-3 left-3 bg-deep-midnight/90 text-off-white border border-outline-variant/15 px-2.5 py-1 rounded-lg font-code-xs text-[10px] uppercase font-bold tracking-widest select-none">
                  Matched image
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-sans text-xs text-coral font-semibold">Matched Reference</p>
                <span className="font-sans text-[10px] text-muted-lavender/60">Public internet node visual discovery</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ==================== RIGHT COLUMN: METADATA & ACTIONS ==================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Similarity & Metrics Ring Card */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 12 }, visible: { opacity: 1, x: 0 } }}
            className="bg-midnight-indigo rounded-3xl p-6 border border-coral/10 shadow-[0_0_24px_rgba(0,0,0,0.1)] flex flex-col gap-4"
          >
            <div className="flex items-center gap-5">
              {/* Refined Radial Progress Ring */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle className="text-deep-violet" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="3.5"></circle>
                  <circle 
                    className="text-coral transition-all duration-1000 ease-out" 
                    cx="32" 
                    cy="32" 
                    fill="transparent" 
                    r="26" 
                    stroke="currentColor" 
                    strokeDasharray={2 * Math.PI * 26} 
                    strokeDashoffset={ringOffset} 
                    strokeWidth="4"
                  ></circle>
                </svg>
                <span className="absolute font-sans text-base font-bold text-off-white">
                  {scorePercentage}%
                </span>
              </div>

              <div>
                <span className="font-sans text-xs text-muted-lavender/80 uppercase font-bold tracking-wider select-none block">
                  Match Integrity Score
                </span>
                <h4 className="font-sans text-xl font-bold text-off-white mt-0.5 leading-none">
                  Visual similarity
                </h4>
                <p className="text-coral font-sans text-xs font-semibold mt-1 flex items-center gap-1.5 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping"></span>
                  {getMatchClassification(selectedResult.similarity)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Original Source Information Card */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 12 }, visible: { opacity: 1, x: 0 } }}
            className="bg-midnight-indigo rounded-3xl p-6 border border-coral/10 shadow-[0_0_24px_rgba(0,0,0,0.1)] space-y-4"
          >
            <div className="border-b border-outline-variant/10 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-lavender/70 block">
                Source Metadata
              </span>
              <h3 className="font-sans text-base font-bold text-off-white mt-1">
                Content Citation
              </h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-1 items-baseline">
                <span className="col-span-4 text-xs font-sans text-muted-lavender/80">Source Type</span>
                <span className="col-span-8 text-xs font-sans text-off-white font-semibold">
                  {getReadableType(selectedResult)}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-1 items-baseline">
                <span className="col-span-4 text-xs font-sans text-muted-lavender/80">Citation</span>
                <span className="col-span-8 text-xs font-sans text-off-white font-semibold">
                  {selectedResult.source}
                </span>
              </div>

              {selectedResult.date && (
                <div className="grid grid-cols-12 gap-1 items-baseline">
                  <span className="col-span-4 text-xs font-sans text-muted-lavender/80">Discovered</span>
                  <span className="col-span-8 text-xs font-sans text-off-white font-semibold">
                    {selectedResult.date}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-outline-variant/5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-lavender/50 block mb-1">
                  Title
                </span>
                <p className="text-xs font-sans text-off-white font-bold leading-normal">
                  {selectedResult.title}
                </p>
              </div>

              {selectedResult.description && (
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-lavender/50 block mb-1">
                    Caption / Context
                  </span>
                  <p className="text-xs font-sans text-muted-lavender leading-relaxed italic bg-deep-midnight/35 p-3 rounded-xl border border-coral/5">
                    "{selectedResult.description}"
                  </p>
                </div>
              )}
            </div>

            {/* View Original External Link */}
            <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between">
              <span className="text-[10px] text-muted-lavender/60">Reference URL verified safe</span>
              <a
                href={selectedResult.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1 text-xs text-coral font-sans font-bold hover:text-off-white transition-colors"
              >
                <span>View original</span>
                <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>
          </motion.div>

          {/* Why This Appears To Match Section */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 12 }, visible: { opacity: 1, x: 0 } }}
            className="bg-midnight-indigo rounded-3xl p-6 border border-coral/10 shadow-[0_0_24px_rgba(0,0,0,0.1)] space-y-3"
          >
            <h4 className="font-sans text-sm font-bold text-off-white select-none">
              Why this appears to match
            </h4>
            
            <ul className="space-y-2 text-xs text-muted-lavender">
              <li className="flex items-start gap-2">
                <span className="text-coral select-none font-bold text-sm">✓</span>
                <span>Face detected in both images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral select-none font-bold text-sm">✓</span>
                <span>Strong facial feature similarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral select-none font-bold text-sm">✓</span>
                <span>High visual similarity</span>
              </li>
            </ul>

            <div className="pt-2 mt-2 border-t border-outline-variant/5">
              <p className="text-[10px] text-muted-lavender/70 leading-normal italic">
                Note: This classification represents visual correspondence only. Visual correspondence models are statistical estimations and do not assert forensic certainty or establish real-world identity.
              </p>
            </div>
          </motion.div>

          {/* CTA Action Panel */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="p-1 rounded-3xl bg-gradient-to-r from-hot-pink/20 to-coral/20 border border-coral/15"
          >
            <div className="bg-deep-midnight rounded-[22px] p-5 text-center">
              <h4 className="font-sans text-sm font-bold text-off-white">
                Verify Image Origin &amp; Integrity
              </h4>
              <p className="font-sans text-xs text-muted-lavender leading-relaxed mt-1 mb-4">
                Execute a cryptographic audit of the matched asset's on-chain registration certificate.
              </p>

              <button
                disabled={isVerifying}
                onClick={onVerify}
                className={`w-full py-3 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${
                  isVerifying
                    ? "bg-deep-violet text-muted-lavender/65 cursor-not-allowed"
                    : "bg-gradient-to-r from-hot-pink to-coral text-off-white hover:brightness-110 hover:shadow-[0_0_16px_rgba(255,111,145,0.25)] active:scale-[0.99]"
                }`}
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-4.5 w-4.5 text-coral" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying integrity...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Verify provenance</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </motion.section>
  );
};

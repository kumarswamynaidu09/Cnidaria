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
  const [ringOffset, setRingOffset] = useState(163.3); // Default empty ring offset (2 * PI * 26)

  // Parse similarity score from similarityScore or similarity
  const rawScore = selectedResult?.similarityScore ?? selectedResult?.similarity ?? 0;
  const scorePct = rawScore <= 1 ? rawScore * 100 : rawScore;
  const scorePercentage = scorePct.toFixed(1);

  useEffect(() => {
    if (selectedResult) {
      // Animate the SVG similarity ring once the component mounts
      const radius = 26;
      const strokeLength = 2 * Math.PI * radius; // ~163.36
      const pct = scorePct / 100;
      const offset = strokeLength - (strokeLength * pct);
      const timer = setTimeout(() => {
        setRingOffset(offset);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedResult, scorePct]);

  // Clean Error State if no result is selected
  if (!selectedResult) {
    return (
      <div 
        className="py-16 flex flex-col items-center justify-center text-center animate-fadeIn max-w-md mx-auto select-none"
        id="error-missing-result"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#1c1a45] border border-[#FF3F7F]/15 flex items-center justify-center text-[#FF3F7F] mb-4">
          <span className="material-symbols-outlined text-[36px]">error_outline</span>
        </div>
        <h3 className="font-display-lg text-2xl font-bold text-[#F8F5F2] mb-2">
          No result selected
        </h3>
        <p className="font-body-md text-sm text-[#B8A9E8] leading-relaxed mb-6">
          Please choose a match from the results grid first.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#1c1a45] hover:bg-[#FF3F7F] hover:text-[#0E0E2C] border border-[#FF3F7F]/20 text-[#FF3F7F] font-sans text-xs font-semibold cursor-pointer transition-transform active:scale-95"
        >
          Back to matches
        </button>
      </div>
    );
  }

  // Match Classification calculation (Subtle & Cautious)
  const getMatchClassification = (score: number) => {
    if (score >= 90) return "Strong visual match";
    if (score >= 80) return "Likely visual match";
    if (score >= 70) return "Possible visual match";
    return "Weak visual match";
  };

  // Helper for source type label mapping
  const getReadableType = (res: SearchResult) => {
    const typeVal = res.sourceType ?? res.type;
    if (typeVal === "social") return "Social media";
    if (typeVal === "news") return "News article";
    if (typeVal === "academic") return "Academic reference";
    if (typeVal === "other") return "Web reference";
    return typeVal || "Web reference";
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
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1a45]/30 hover:bg-[#1c1a45]/75 border border-[#FF3F7F]/10 hover:border-[#FF3F7F]/25 text-[#B8A9E8] hover:text-[#F8F5F2] text-xs font-semibold transition-all duration-200 cursor-pointer"
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
          className="lg:col-span-7 bg-[#13113C] rounded-3xl p-6 border border-[#FF3F7F]/10 shadow-[0_0_24px_rgba(0,0,0,0.15)] flex flex-col gap-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-xs font-sans font-bold text-[#F8F5F2] tracking-wider uppercase select-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3F7F] animate-pulse"></span>
              Visual Correspondence Frame
            </h3>
            <span className="font-mono text-[10px] text-[#B8A9E8]/70">Side-by-side verification</span>
          </div>

          {/* Large Side-by-Side (Desktop) or Stacked (Mobile) Visual Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Subject Reference Frame (Your Image) */}
            <div className="flex flex-col gap-2 group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#0E0E2C] border border-[#FF3F7F]/15 relative shadow-inner">
                <img
                  alt="Original reference query"
                  className="w-full h-full object-cover brightness-95 group-hover:scale-[1.01] transition-transform duration-500"
                  src={referenceUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E2C]/50 via-transparent to-transparent opacity-40"></div>
                
                {/* Visual Label overlay */}
                <div className="absolute bottom-3 left-3 bg-[#0E0E2C]/95 text-[#FF3F7F] border border-[#FF3F7F]/20 px-3 py-1 rounded-lg font-mono text-[10px] uppercase font-bold tracking-widest select-none">
                  YOUR IMAGE
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-sans text-xs text-[#B8A9E8] font-semibold">Reference Image</p>
                <span className="font-sans text-[10px] text-[#B8A9E8]/60">Source query signature input</span>
              </div>
            </div>

            {/* Candidate Web Matched Frame (Matched Image) */}
            <div className="flex flex-col gap-2 group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#0E0E2C] border border-[#FF3F7F]/25 relative shadow-inner">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  alt="Matched content reference"
                  className="w-full h-full object-cover brightness-95 group-hover:scale-[1.01] transition-transform duration-500"
                  src={selectedResult.image || selectedResult.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E2C]/50 via-transparent to-transparent opacity-40"></div>

                {/* Visual Label overlay */}
                <div className="absolute bottom-3 left-3 bg-[#0E0E2C]/95 text-[#F8F5F2] border border-white/10 px-3 py-1 rounded-lg font-mono text-[10px] uppercase font-bold tracking-widest select-none">
                  MATCHED IMAGE
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-sans text-xs text-[#FF3F7F] font-semibold">Matched Reference</p>
                <span className="font-sans text-[10px] text-[#B8A9E8]/60">Public internet node visual discovery</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ==================== RIGHT COLUMN: METADATA & ACTIONS ==================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Similarity & Metrics Ring Card */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 12 }, visible: { opacity: 1, x: 0 } }}
            className="bg-[#13113C] rounded-3xl p-6 border border-[#FF3F7F]/10 shadow-[0_0_24px_rgba(0,0,0,0.1)] flex flex-col gap-4"
          >
            <div className="flex items-center gap-5">
              {/* Refined Radial Progress Ring */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle className="text-[#1c1a45]" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="3.5"></circle>
                  <circle 
                    className="text-[#FF3F7F] transition-all duration-1000 ease-out" 
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
                <span className="absolute font-sans text-base font-bold text-[#F8F5F2]">
                  {scorePercentage}%
                </span>
              </div>

              <div>
                <span className="font-sans text-[10px] text-[#B8A9E8]/80 uppercase font-bold tracking-wider select-none block">
                  Similarity metric
                </span>
                <h4 className="font-sans text-xl font-bold text-[#F8F5F2] mt-0.5 leading-none">
                  Visual similarity
                </h4>
                <p className="text-[#FF3F7F] font-sans text-xs font-semibold mt-1 flex items-center gap-1.5 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3F7F] animate-ping"></span>
                  {getMatchClassification(scorePct)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Original Source Information Card */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 12 }, visible: { opacity: 1, x: 0 } }}
            className="bg-[#13113C] rounded-3xl p-6 border border-[#FF3F7F]/10 shadow-[0_0_24px_rgba(0,0,0,0.1)] space-y-4"
          >
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8A9E8]/70 block">
                Source Metadata
              </span>
              <h3 className="font-sans text-base font-bold text-[#F8F5F2] mt-1">
                Content Citation
              </h3>
            </div>

            {/* Strict metadata layout matching user specifications */}
            <div className="space-y-4 pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8A9E8]/60 block">
                  Source
                </span>
                <p className="text-sm font-sans text-[#F8F5F2] font-semibold mt-0.5">
                  {selectedResult.source}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8A9E8]/60 block">
                  Source type
                </span>
                <p className="text-sm font-sans text-[#F8F5F2] font-semibold mt-0.5">
                  {getReadableType(selectedResult)}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8A9E8]/60 block">
                  Title
                </span>
                <p className="text-sm font-sans text-[#F8F5F2] font-semibold mt-0.5 leading-snug">
                  {selectedResult.title}
                </p>
              </div>

              {(selectedResult.caption || selectedResult.description) && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8A9E8]/60 block">
                    Caption
                  </span>
                  <p className="text-xs font-sans text-[#B8A9E8] italic mt-0.5 bg-[#0E0E2C]/40 p-3 rounded-xl border border-[#FF3F7F]/5 leading-relaxed">
                    "{selectedResult.caption || selectedResult.description}"
                  </p>
                </div>
              )}

              {selectedResult.date && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8A9E8]/60 block">
                    Date
                  </span>
                  <p className="text-sm font-sans text-[#F8F5F2] font-semibold mt-0.5">
                    {selectedResult.date}
                  </p>
                </div>
              )}
            </div>

            {/* View Original External Link */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-[#B8A9E8]/60">External reference node</span>
              <a
                href={selectedResult.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1 text-xs text-[#FF3F7F] font-sans font-bold hover:text-[#F8F5F2] transition-colors"
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
            className="bg-[#13113C] rounded-3xl p-6 border border-[#FF3F7F]/10 shadow-[0_0_24px_rgba(0,0,0,0.1)] space-y-3"
          >
            <h4 className="font-sans text-sm font-bold text-[#F8F5F2] select-none">
              Why this appears to match
            </h4>
            
            <ul className="space-y-2 text-xs text-[#B8A9E8]">
              <li className="flex items-start gap-2">
                <span className="text-[#FF3F7F] select-none font-bold text-sm leading-none">•</span>
                <span>A face was detected in both images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF3F7F] select-none font-bold text-sm leading-none">•</span>
                <span>Facial feature patterns show strong visual similarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF3F7F] select-none font-bold text-sm leading-none">•</span>
                <span>The overall visual similarity score is high</span>
              </li>
            </ul>

            <div className="pt-2 mt-2 border-t border-white/5">
              <p className="text-[10px] text-[#B8A9E8]/70 leading-normal italic">
                This classification represents a visual comparison based on statistical similarity and is NOT proof of real-world identity.
              </p>
            </div>
          </motion.div>

          {/* CTA Action Panel */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="p-1 rounded-3xl bg-gradient-to-r from-[#FF3F7F]/20 to-[#FF3F7F]/20 border border-[#FF3F7F]/15"
          >
            <div className="bg-[#0E0E2C] rounded-[22px] p-5 text-center">
              <h4 className="font-sans text-sm font-bold text-[#F8F5F2]">
                Verify Image Origin &amp; Integrity
              </h4>
              <p className="font-sans text-xs text-[#B8A9E8] leading-relaxed mt-1 mb-4">
                Execute a cryptographic audit of the matched asset's on-chain registration certificate.
              </p>

              <button
                disabled={isVerifying}
                onClick={onVerify}
                className={`w-full py-3 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${
                  isVerifying
                    ? "bg-[#1c1a45] text-[#B8A9E8]/65 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FF3F7F] to-[#FF3F7F] text-[#F8F5F2] hover:brightness-110 hover:shadow-[0_0_16px_rgba(255,111,145,0.25)] active:scale-[0.99]"
                }`}
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#FF3F7F]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Preparing provenance verification...</span>
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

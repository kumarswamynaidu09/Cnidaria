import React, { useState } from "react";
import { motion } from "motion/react";
import { SearchResult } from "../types/pipeline";

interface ResultsViewProps {
  results: SearchResult[];
  referenceThumb: string;
  onBack: () => void;
  onInspectResult: (result: SearchResult) => void;
  selectedResult?: SearchResult | null;
}

// ----------------------------------------------------
// MATCH STRENGTH UTILITY
// ----------------------------------------------------
const getMatchStrength = (similarity: number) => {
  const score = similarity * 100;
  if (score >= 90) {
    return { label: "Strong match", colorClass: "text-coral" };
  } else if (score >= 80) {
    return { label: "Likely match", colorClass: "text-soft-pink" };
  } else if (score >= 70) {
    return { label: "Possible match", colorClass: "text-lavender" };
  } else {
    return { label: "Weak match", colorClass: "text-muted-lavender" };
  }
};

// ----------------------------------------------------
// REUSABLE SUB-COMPONENT: SearchResultCard
// ----------------------------------------------------
interface SearchResultCardProps {
  result: SearchResult;
  isHighest: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  isHighest,
  isSelected,
  onClick
}) => {
  const percentage = (result.similarity * 100).toFixed(1);
  const { label: strengthLabel, colorClass: strengthColor } = getMatchStrength(result.similarity);

  // Format type nicely
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
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative bg-midnight-indigo rounded-2xl border cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-300 ${
        isSelected
          ? "border-coral ring-1 ring-coral shadow-[0_0_24px_rgba(255,111,145,0.15)]"
          : isHighest
            ? "border-coral/40 shadow-[0_0_20px_rgba(255,111,145,0.08)] bg-midnight-indigo"
            : "border-coral/10 hover:border-coral/25 bg-midnight-indigo/80"
      }`}
    >
      {/* "Best Visual Match" subtle header accent */}
      {isHighest && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-hot-pink/90 to-coral/90 text-off-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow border border-coral/15 select-none">
          Best visual match
        </div>
      )}

      {/* Image First Container - Occupies most of the visual area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-deep-midnight border-b border-outline-variant/10">
        <img
          alt={result.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90"
          src={result.imageUrl}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-midnight/50 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Card Metadata Details */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        
        {/* Similarity Score & Match Strength */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-baseline gap-1">
            <span className="font-sans text-lg sm:text-xl font-bold text-off-white">
              {percentage}%
            </span>
            <span className="font-sans text-[10px] text-muted-lavender uppercase tracking-wide">
              Visual similarity
            </span>
          </div>
          <span className={`font-sans text-xs font-semibold ${strengthColor}`}>
            {strengthLabel}
          </span>
        </div>

        {/* Source info, Type, and Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-muted-lavender/80 font-medium">
            <span>{getReadableType(result)}</span>
            {result.date && <span>{result.date}</span>}
          </div>
          <h4 className="font-sans text-sm font-semibold text-off-white leading-snug line-clamp-2 group-hover:text-coral transition-colors">
            {result.title}
          </h4>
        </div>

        {/* Action and Source Link */}
        <div className="pt-2 border-t border-outline-variant/5 flex items-center justify-between">
          <span className="font-sans text-[11px] text-muted-lavender font-semibold group-hover:text-off-white transition-colors">
            {result.source}
          </span>
          <span className="text-coral font-sans text-[11px] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View source <span className="material-symbols-outlined text-[12px] font-bold">arrow_forward</span>
          </span>
        </div>

      </div>
    </motion.div>
  );
};

// ----------------------------------------------------
// MAIN ResultsView COMPONENT
// ----------------------------------------------------
export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  referenceThumb,
  onBack,
  onInspectResult,
  selectedResult
}) => {
  const [showErrorDemo, setShowErrorDemo] = useState(false);
  const [showEmptyDemo, setShowEmptyDemo] = useState(false);

  // Fallback state buttons support
  if (showErrorDemo) {
    return (
      <div className="stage-view py-16 flex flex-col items-center justify-center text-center animate-fadeIn max-w-md mx-auto select-none">
        <div className="w-16 h-16 rounded-2xl bg-deep-violet border border-coral/25 flex items-center justify-center text-coral mb-4">
          <span className="material-symbols-outlined text-[36px]">error_outline</span>
        </div>
        <h3 className="font-display-lg text-2xl font-bold text-off-white mb-2">
          Search unavailable
        </h3>
        <p className="font-body-md text-sm text-muted-lavender leading-relaxed mb-6">
          Something went wrong while searching public sources.
        </p>
        <button
          onClick={() => {
            setShowErrorDemo(false);
            onBack();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-hot-pink to-coral text-off-white font-sans text-xs font-semibold cursor-pointer border-0 transition-transform active:scale-95"
        >
          Try again
        </button>
      </div>
    );
  }

  if (showEmptyDemo || results.length === 0) {
    return (
      <div className="stage-view py-16 flex flex-col items-center justify-center text-center animate-fadeIn max-w-md mx-auto select-none">
        <div className="w-16 h-16 rounded-2xl bg-deep-violet border border-coral/15 flex items-center justify-center text-muted-lavender mb-4">
          <span className="material-symbols-outlined text-[36px]">search_off</span>
        </div>
        <h3 className="font-display-lg text-2xl font-bold text-off-white mb-2">
          No visual matches found
        </h3>
        <p className="font-body-md text-sm text-muted-lavender leading-relaxed mb-6">
          Try another image or a clearer reference.
        </p>
        <button
          onClick={() => {
            setShowEmptyDemo(false);
            onBack();
          }}
          className="px-6 py-2.5 rounded-xl bg-deep-violet hover:bg-coral hover:text-deep-midnight border border-coral/20 text-coral font-sans text-xs font-semibold cursor-pointer transition-transform active:scale-95"
        >
          New search
        </button>
      </div>
    );
  }

  // Sort results so the highest similarity is always first in the grid for subtle emphasis
  const sortedResults = [...results].sort((a, b) => b.similarity - a.similarity);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
      }}
      className="stage-view block py-4 select-none"
      id="view-results"
    >
      
      {/* Results Title Banner */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
        className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-outline-variant/15 select-none"
      >
        <div>
          <h2 className="font-display-lg text-3xl font-bold text-off-white">
            Visual matches
          </h2>
          <p className="font-body-md text-sm text-muted-lavender mt-0.5">
            Public content visually similar to your image
          </p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 rounded-full bg-deep-violet text-coral border border-coral/15 font-mono text-[10px] font-bold tracking-wider">
            14 visual candidates analyzed
          </span>
        </div>
      </motion.div>

      {/* Main Results Grid Layout (Responsive Multi-Column Structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== LEFT COLUMN: ORIGINAL IMAGE MODULE ==================== */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
          className="lg:col-span-3 space-y-5 lg:sticky lg:top-24"
        >
          <div className="bg-midnight-indigo rounded-3xl p-5 border border-coral/10 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <span className="font-sans text-[11px] uppercase font-bold tracking-wider text-muted-lavender block mb-3">
              Your image
            </span>

            {/* Compact version of user's uploaded portrait image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-deep-midnight border border-coral/20 relative shadow-inner">
              <img
                alt="Uploaded Searched Target"
                className="w-full h-full object-cover filter brightness-95"
                src={referenceThumb}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border border-coral/20 rounded-2xl pointer-events-none"></div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/5 text-center">
              <button
                onClick={onBack}
                className="w-full px-4 py-2.5 rounded-xl bg-deep-violet hover:bg-coral hover:text-deep-midnight border border-coral/20 text-coral font-sans text-xs font-semibold cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">refresh</span>
                <span>New Search</span>
              </button>
            </div>
          </div>

          {/* Understated Demo Testing Sandbox Controller */}
          <div className="p-4 rounded-2xl bg-deep-violet/15 border border-coral/5 select-none space-y-2.5">
            <span className="font-code-xs text-[9px] text-muted-lavender/60 tracking-wider uppercase font-bold block">
              Demo Sandbox
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmptyDemo(true)}
                className="flex-1 text-[9px] font-mono py-1 rounded bg-deep-violet hover:bg-coral/10 text-muted-lavender border border-outline-variant/10 cursor-pointer"
              >
                Sim Empty State
              </button>
              <button
                onClick={() => setShowErrorDemo(true)}
                className="flex-1 text-[9px] font-mono py-1 rounded bg-deep-violet hover:bg-coral/10 text-muted-lavender border border-outline-variant/10 cursor-pointer"
              >
                Sim Error State
              </button>
            </div>
          </div>

          {/* AI-Powered Image Overview Section */}
          <div className="bg-midnight-indigo rounded-3xl p-5 border border-coral/15 shadow-[0_0_20px_rgba(0,0,0,0.15)] space-y-4 select-none animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-coral">psychology</span>
                <span className="font-sans text-xs font-bold text-off-white uppercase tracking-wider">
                  Overview
                </span>
              </div>
              <span className="font-mono text-[9px] text-coral bg-deep-violet px-2 py-0.5 rounded border border-coral/15">
                AI Vision Analysis
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <span className="text-[10px] text-muted-lavender/70 font-semibold uppercase tracking-wider block mb-0.5">
                  Subject Attribution
                </span>
                <p className="text-off-white font-bold text-xs">
                  {results[0]?.title ? results[0].title.split(":")[0] || "Detected Subject Portrait" : "Detected Subject Portrait"}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-muted-lavender/70 font-semibold uppercase tracking-wider block mb-0.5">
                  Visual Features Overview
                </span>
                <p className="text-muted-lavender text-[11px] leading-relaxed bg-deep-midnight/50 p-2.5 rounded-xl border border-white/5">
                  High-definition facial features extracted via 512-dimensional ArcFace neural embeddings. Features frontal geometry, facial landmarks, and uncompressed SHA-256 content fingerprinting.
                </p>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-muted-lavender/70 font-semibold uppercase tracking-wider block mb-1">
                  Key Index Tags
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[9px]">
                  <span className="px-2 py-0.5 rounded-md bg-deep-violet text-coral border border-coral/15">#InsightFace</span>
                  <span className="px-2 py-0.5 rounded-md bg-deep-violet text-coral border border-coral/15">#ArcFace512d</span>
                  <span className="px-2 py-0.5 rounded-md bg-deep-violet text-coral border border-coral/15">#SHA256</span>
                  <span className="px-2 py-0.5 rounded-md bg-deep-violet text-coral border border-coral/15">#EVM-Attested</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>

        {/* ==================== RIGHT COLUMN: DISCOVERED RESULTS GRID ==================== */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="lg:col-span-9"
        >
          {/* Responsive grid: Desktop (3 columns), Tablet (2 columns), Mobile (1 column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6" id="resultsGrid">
            {sortedResults.map((item, idx) => {
              // Highlight the highest match (index 0 because we sorted by similarity desc)
              const isHighest = idx === 0;
              const isSelected = selectedResult?.id === item.id;

              return (
                <SearchResultCard
                  key={item.id}
                  result={item}
                  isHighest={isHighest}
                  isSelected={isSelected}
                  onClick={() => onInspectResult(item)}
                />
              );
            })}
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

import React from "react";

interface CrawlingViewProps {
  referenceUrl: string;
  searchStep: number; // 1 to 6
  statusText: string;
  vectorHash: string;
  onReset: () => void;
  onRestart: () => void;
}

// Rename React component internally to match Web Search semantic guidelines
export const CrawlingView: React.FC<CrawlingViewProps> = ({
  referenceUrl,
  searchStep,
  statusText,
  vectorHash,
  onReset,
  onRestart
}) => {
  // Generate 14 mock visual fingerprint candidate profiles
  const candidates = Array.from({ length: 14 }).map((_, index) => {
    const idNum = String(index + 1).padStart(2, "0");
    
    // Create diverse premium gradients from the Cnidaria color scheme
    const gradientPresets = [
      "from-midnight-indigo via-deep-violet to-coral/30",
      "from-deep-violet via-coral/20 to-hot-pink/20",
      "from-midnight-indigo via-lavender/20 to-coral/30",
      "from-deep-violet via-hot-pink/15 to-soft-pink/25",
      "from-deep-midnight via-deep-violet to-lavender/35",
    ];
    const gradient = gradientPresets[index % gradientPresets.length];
    
    // Abstract shapes to simulate face components in a stylized manner
    const shapes = [
      { top: "25%", left: "30%", w: "40%", h: "45%", rounded: "rounded-[40%_40%_50%_50%]" },
      { top: "20%", left: "35%", w: "30%", h: "50%", rounded: "rounded-[50%_50%_40%_40%]" },
      { top: "30%", left: "25%", w: "50%", h: "40%", rounded: "rounded-full" },
    ];
    const shape = shapes[index % shapes.length];

    return {
      id: `CAND-${idNum}`,
      gradient,
      shape,
      matchIndex: (0.98 - index * 0.03).toFixed(3),
    };
  });

  // Calculate visible count based on current search stage progress
  const getVisibleCount = () => {
    if (searchStep <= 1) return 1;
    if (searchStep === 2) return 3;
    if (searchStep === 3) return 5;
    if (searchStep === 4) return 8;
    return 14;
  };

  const visibleCount = getVisibleCount();

  // Determine blurring level depending on search step
  const getBlurClass = () => {
    if (searchStep <= 2) return "blur-md scale-95 opacity-50";
    if (searchStep === 3) return "blur-sm scale-98 opacity-80";
    if (searchStep === 4) return "blur-[1px] scale-100 opacity-95";
    return "blur-0 scale-100 opacity-100";
  };

  // Status List items
  const statusItems = [
    { step: 1, label: "Searching public sources" },
    { step: 2, label: "Finding visual matches" },
    { step: 3, label: "Comparing visual features" },
    { step: 4, label: "Comparing faces" },
    { step: 5, label: "Ranking candidates" },
    { step: 6, label: "Search complete" }
  ];

  // Subtle Counter label mapping
  const getCounterText = () => {
    if (searchStep <= 1) return "Scanning public sources...";
    if (searchStep <= 3) return `${visibleCount} candidates discovered`;
    return `14 candidates analyzed`;
  };

  return (
    <section className="stage-view block animate-fadeIn py-4 select-none" id="view-crawling">
      
      {/* Search Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10 select-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep-violet text-coral font-code-xs text-[11px] border border-coral/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping"></span>
          <span className="font-semibold tracking-wider font-mono">WEB CLUSTERING MATRIX</span>
        </div>
        <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-off-white leading-tight">
          {searchStep === 6 ? "Search complete" : "Searching the web"}
        </h2>
        <p className="font-body-md text-sm text-muted-lavender leading-relaxed mt-1">
          Looking for visually similar public content based on computed 512-D geometric landmark signatures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* ==================== LEFT COLUMN: RADAR CENTRAL & SEQUENCER ==================== */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* RADAR CENTERPIECE WITH RADIATING EXPANDING SEARCH WAVES */}
          <div className="bg-midnight-indigo rounded-3xl p-6 border border-coral/10 shadow-[0_0_30px_rgba(255,111,145,0.02)] relative overflow-hidden flex flex-col items-center">
            
            {/* Concentric pulsing expansion waves */}
            {searchStep < 6 && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
                <div className="absolute w-36 h-36 rounded-full border border-coral/15 animate-pulse-expand-slow"></div>
                <div className="absolute w-48 h-48 rounded-full border border-coral/10 animate-pulse-expand"></div>
                <div className="absolute w-64 h-64 rounded-full border border-coral/5 animate-pulse-expand-fast"></div>
              </div>
            )}

            {/* Centered reference image viewport */}
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-deep-midnight border border-coral/30 z-10 shadow-[0_0_24px_rgba(255,63,127,0.25)] shrink-0">
              <img 
                alt="Search Reference Target" 
                className="w-full h-full object-cover opacity-90 filter brightness-90" 
                src={referenceUrl} 
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 bg-deep-midnight/90 text-coral border border-coral/25 px-1.5 py-0.5 rounded font-mono text-[8px] font-semibold tracking-wide">
                ID: {vectorHash.slice(0, 4)}
              </span>
            </div>

            <div className="text-center mt-4 z-10">
              <span className="text-xs font-semibold text-off-white block font-sans">
                Active Reference Subject
              </span>
              {/* Understated search status counters */}
              <span className="font-mono text-[10px] text-coral font-medium block mt-1 tracking-wider uppercase animate-pulse">
                {getCounterText()}
              </span>
            </div>

          </div>

          {/* PIPELINE SEQUENCE STATUS MONITOR */}
          <div className="bg-midnight-indigo rounded-3xl p-6 border border-coral/10 space-y-3.5 shadow-[0_0_20px_rgba(0,0,0,0.15)]">
            <span className="font-label-sm text-[10px] tracking-wider uppercase text-muted-lavender font-bold block pb-1 border-b border-outline-variant/15">
              Sequence Monitor
            </span>
            <div className="space-y-3">
              {statusItems.map(item => {
                const isCompleted = searchStep > item.step;
                const isActive = searchStep === item.step;
                const isPending = searchStep < item.step;

                return (
                  <div 
                    key={item.step} 
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      isActive ? "scale-[1.01] opacity-100" : isCompleted ? "opacity-90" : "opacity-35"
                    }`}
                  >
                    {/* Compact indicator nodes */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border shrink-0 transition-colors ${
                      isCompleted 
                        ? "bg-coral border-coral text-deep-midnight" 
                        : isActive 
                          ? "bg-deep-violet border-coral text-coral animate-pulse" 
                          : "bg-deep-midnight border-outline-variant/10 text-muted-lavender"
                    }`}>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[11px] font-bold">check</span>
                      ) : isActive ? (
                        <span className="material-symbols-outlined text-[11px] animate-spin">sync</span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-lavender"></span>
                      )}
                    </div>

                    <span className={`font-sans text-xs font-medium ${
                      isActive ? "text-coral font-semibold" : isCompleted ? "text-off-white" : "text-muted-lavender/80"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ==================== RIGHT COLUMN: PROGRESSIVE CANDIDATE DISCOVERY ==================== */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-midnight-indigo/90 rounded-3xl p-6 border border-coral/10 shadow-[0_0_30px_rgba(255,111,145,0.02)]">
            
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/15 mb-5">
              <span className="font-label-sm text-xs uppercase font-bold tracking-wider text-muted-lavender">
                Discovered Candidates Network
              </span>
              <span className="font-code-xs text-[10px] px-2.5 py-0.5 rounded bg-deep-violet text-coral font-mono border border-coral/15 font-bold">
                STAGE {searchStep}/6
              </span>
            </div>

            {/* Grid of Progressive Candidates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transition-all duration-500">
              {candidates.slice(0, visibleCount).map((cand, i) => (
                <div 
                  key={cand.id}
                  className={`bg-deep-midnight/80 rounded-2xl p-3 border border-coral/5 hover:border-coral/20 transition-all duration-500 flex flex-col justify-between h-32 relative group overflow-hidden ${getBlurClass()}`}
                >
                  {/* Subtle scanning sweeps within candidates */}
                  {searchStep < 5 && (
                    <div className="absolute inset-x-0 h-0.5 bg-coral/20 shadow-[0_0_10px_#ff3f7f] animate-scan-beam top-0 pointer-events-none"></div>
                  )}

                  {/* Stylized face geometric cluster placeholder */}
                  <div className={`relative w-full h-16 rounded-xl bg-gradient-to-tr ${cand.gradient} overflow-hidden border border-outline-variant/5 shadow-inner`}>
                    <div className={`absolute bg-coral/10 border border-coral/15 shadow-[0_0_12px_rgba(255,111,145,0.1)] ${cand.shape.rounded}`} style={{
                      top: cand.shape.top,
                      left: cand.shape.left,
                      width: cand.shape.w,
                      height: cand.shape.h,
                    }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-2 select-none">
                    <span className="font-code-xs text-[9px] text-muted-lavender font-mono">
                      {cand.id}
                    </span>
                    <span className="font-code-xs text-[9px] text-coral font-semibold font-mono">
                      {searchStep >= 5 ? `Sim: ${cand.matchIndex}` : "Comparing..."}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty grid state filler */}
            {visibleCount === 1 && (
              <div className="py-12 text-center text-muted-lavender/50 italic text-xs animate-fadeIn font-mono">
                Searching public sources... more visual candidates will progressively lock onto grid.
              </div>
            )}

            {/* Complete action block overlay */}
            {searchStep === 6 && (
              <div className="mt-6 p-4 rounded-2xl bg-deep-violet/30 border border-coral/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <div className="text-left select-none">
                  <span className="font-sans text-xs font-semibold text-coral block">
                    ✓ Search Completed
                  </span>
                  <span className="font-sans text-[11px] text-muted-lavender">
                    14 visual candidates analyzed &amp; ranked. Ready for Task 4 results.
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-hot-pink to-coral text-off-white font-label-md text-xs font-semibold hover:brightness-110 cursor-pointer border-0 shadow-md active:scale-95 transition-all"
                    onClick={onRestart}
                  >
                    Restart Search
                  </button>
                  <button 
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-deep-violet border border-outline hover:border-coral/20 text-muted-lavender hover:text-off-white font-label-md text-xs font-semibold cursor-pointer transition-all active:scale-95"
                    onClick={onReset}
                  >
                    Return to Upload
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Understated bottom prompt */}
          <div className="p-5 rounded-2xl bg-deep-violet/20 border border-coral/10 text-center select-none font-sans">
            <span className="font-code-xs text-[10px] text-muted-lavender uppercase tracking-wider block mb-1">
              DEMONSTRATION PROTOCOL NOTE
            </span>
            <p className="font-body-sm text-xs text-muted-lavender/80 max-w-xl mx-auto leading-relaxed">
              These candidate image cells represent generated visual fingerprint placeholders created locally to simulate real comparison nodes before backend APIs are attached.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

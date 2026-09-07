import React from "react";
import { SearchResult } from "../types/pipeline";

interface ProvenanceDrawerProps {
  isOpen: boolean;
  result: SearchResult | null;
  onClose: () => void;
  onVerify: () => void;
  simulateTampering: boolean;
  setSimulateTampering: (val: boolean) => void;
  activePresetCropRef: string;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({
  isOpen,
  result,
  onClose,
  onVerify,
  activePresetCropRef
}) => {
  if (!result) return null;

  const percentage = (result.similarity * 100).toFixed(1);

  // Circle progress calculation
  const radius = 26;
  const strokeLength = 2 * Math.PI * radius;
  const strokeOffset = strokeLength - (strokeLength * result.similarity);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-deep-midnight/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Slide-out Drawer Panel */}
      <aside 
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[480px] lg:w-[500px] bg-midnight-indigo border-l border-coral/10 z-50 transition-transform duration-300 ease-out shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="provenanceDrawer"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-deep-midnight sticky top-0 z-10 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-deep-violet text-coral flex items-center justify-center border border-coral/20">
              <span className="material-symbols-outlined text-[18px]">info</span>
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-off-white">
                Asset Inspector
              </h3>
              <p className="font-code-xs text-[10px] text-muted-lavender/80 tracking-wide uppercase">Attribution &amp; Signature</p>
            </div>
          </div>
          <button 
            className="w-8 h-8 rounded-lg hover:bg-deep-violet flex items-center justify-center text-muted-lavender hover:text-off-white transition-colors border-0 cursor-pointer bg-transparent focus:outline-none" 
            onClick={onClose}
            title="Close Drawer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Side-by-Side Face Comparison */}
          <div className="bg-deep-violet/30 rounded-2xl p-5 border border-coral/10">
            <span className="font-label-sm text-[11px] uppercase font-bold tracking-wider text-muted-lavender block mb-3 select-none">
              Facial Landmark Correspondence
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="aspect-square rounded-xl overflow-hidden bg-deep-midnight border border-coral/30 mb-2 relative">
                  <img 
                    alt="Reference Query" 
                    className="w-full h-full object-cover opacity-90" 
                    src={activePresetCropRef} 
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-deep-midnight/90 text-coral border border-coral/20 px-2 py-0.5 rounded font-code-xs text-[9px] uppercase tracking-wider select-none">Query</span>
                </div>
                <span className="font-code-xs text-[10px] text-muted-lavender">Query Subject</span>
              </div>
              
              <div className="text-center animate-fadeIn">
                <div className="aspect-square rounded-xl overflow-hidden bg-deep-midnight border border-coral/15 mb-2 relative">
                  <img 
                    alt="Matched Web Crop" 
                    className="w-full h-full object-cover opacity-90" 
                    src={result.imageUrl} 
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-deep-midnight/90 text-muted-lavender border border-outline-variant/10 px-2 py-0.5 rounded font-code-xs text-[9px] uppercase tracking-wider select-none font-mono">Web Match</span>
                </div>
                <span className="font-code-xs text-[10px] text-coral font-medium select-none font-mono">Sim Index: 0.036</span>
              </div>
            </div>
          </div>

          {/* Confidence Ring & Vector Metric */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-deep-midnight/60 border border-coral/10">
            <div className="flex items-center gap-4 select-none">
              {/* Radial Progress Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle className="text-deep-violet" cx="28" cy="28" fill="transparent" r="23" stroke="currentColor" strokeWidth="3"></circle>
                  <circle 
                    className="text-coral transition-all duration-1000 ease-out" 
                    cx="28" 
                    cy="28" 
                    fill="transparent" 
                    r="23" 
                    stroke="currentColor" 
                    strokeDasharray={2 * Math.PI * 23} 
                    strokeDashoffset={(2 * Math.PI * 23) - ((2 * Math.PI * 23) * result.similarity)} 
                    strokeWidth="3.5"
                  ></circle>
                </svg>
                <span className="absolute font-sans text-sm font-bold text-off-white">
                  {percentage}%
                </span>
              </div>
              <div>
                <span className="font-label-md text-sm font-semibold text-off-white block">
                  Similarity Verification
                </span>
                <span className="font-body-sm text-xs text-muted-lavender block mt-0.5">
                  Facial landmark correlation level
                </span>
              </div>
            </div>
            
            <span className="px-2.5 py-1 rounded-full bg-deep-violet text-coral border border-coral/20 font-label-sm text-[11px] font-semibold flex items-center gap-1 select-none shrink-0">
              <span className="material-symbols-outlined text-[13px]">lens</span>
              Verified
            </span>
          </div>

          {/* Attribution & Signature metadata */}
          <div className="bg-deep-midnight/40 rounded-2xl p-5 border border-coral/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10 select-none">
              <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-muted-lavender flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-coral">verified</span>
                Visual Attribution
              </span>
              <span className="font-code-xs text-[10px] px-2 py-0.5 rounded bg-deep-violet text-coral font-mono border border-coral/15">
                Authentic Match
              </span>
            </div>
            
            <div className="space-y-3 font-body-sm text-xs">
              <div>
                <span className="text-muted-lavender block font-label-sm text-[10px] tracking-wider uppercase mb-1 select-none">Visual SHA-256 Signature:</span>
                <span className="font-code-xs text-[11px] font-mono text-off-white break-all bg-deep-midnight p-2 rounded block select-all border border-coral/10">
                  {result.sha256}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-lavender block font-label-sm text-[10px] tracking-wider uppercase mb-1 select-none font-sans">Attested Signer:</span>
                  <span className="font-code-xs text-xs text-off-white truncate block font-sans font-medium">
                    {result.signer || "Reuters Editorial Node"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-lavender block font-label-sm text-[10px] tracking-wider uppercase mb-1 select-none font-sans">Discovery Citation:</span>
                  <span className="font-code-xs text-xs text-coral truncate block font-sans font-medium">
                    {result.source}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2.5 border-t border-outline-variant/10 select-none">
                <span className="text-muted-lavender font-label-sm text-[11px] uppercase tracking-wider font-semibold">Indexed Timestamp:</span>
                <span className="font-code-xs text-[11px] text-off-white font-medium font-mono select-all">
                  {result.date || "Oct 14, 2024"} UTC
                </span>
              </div>
            </div>
          </div>

          {/* Action: Trigger Live Re-Verification */}
          <div className="p-5 rounded-2xl bg-deep-violet/30 border border-coral/10 text-center select-none">
            <h4 className="font-label-md text-sm font-semibold text-off-white mb-1 font-sans">
              Perform Content Integrity Check
            </h4>
            <p className="font-body-sm text-xs text-muted-lavender mb-4 max-w-xs mx-auto">
              Directly re-compute the hash signature of this web asset and compare against original capture details live.
            </p>
            <button 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-hot-pink to-coral text-off-white font-label-md text-sm font-semibold hover:shadow-[0_0_15px_rgba(255,63,127,0.3)] hover:brightness-110 active:scale-[0.99] transition-all border-0 cursor-pointer flex items-center justify-center gap-2" 
              onClick={onVerify}
            >
              <span className="material-symbols-outlined text-[18px]">lens</span>
              <span>Verify Integrity</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-outline-variant/10 bg-deep-midnight flex items-center justify-between select-none">
          <span className="font-code-xs text-[11px] text-muted-lavender flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
            Original Provenance Intact
          </span>
          <button 
            className="px-4 py-2 rounded-lg bg-deep-violet hover:bg-deep-violet/80 hover:text-off-white text-muted-lavender font-label-sm text-xs cursor-pointer border-0" 
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </aside>
    </>
  );
};

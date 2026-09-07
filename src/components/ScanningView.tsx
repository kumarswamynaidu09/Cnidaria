import React, { useState, useEffect } from "react";
import { PipelineState, FaceDetection } from "../types/pipeline";

interface ScanningViewProps {
  imageUrl: string;
  state: PipelineState;
  scanStep: number;
  statusText: string;
  subText: string;
  badgeText: string;
  onReset: () => void;
  onRestart: () => void;
}

export const ScanningView: React.FC<ScanningViewProps> = ({
  imageUrl,
  state,
  statusText,
  subText,
  badgeText,
  onReset,
  onRestart
}) => {
  // Predetermined face detection coordinates for visual demo simulation
  const mockFaceDetection: FaceDetection = {
    x: 32,
    y: 20,
    width: 36,
    height: 44,
    confidence: 0.994,
  };

  const isFaceDetectedOrLater = ["face_detected", "face_encoding", "face_encoded"].includes(state);
  const isEncodingOrLater = ["face_encoding", "face_encoded"].includes(state);
  const isEncoded = state === "face_encoded";

  // Elastic animation state for the bounding box
  const [boxStyle, setBoxStyle] = useState({
    left: "5%",
    top: "5%",
    width: "90%",
    height: "90%",
    opacity: 0,
    scale: 1.1,
  });

  useEffect(() => {
    if (isFaceDetectedOrLater) {
      const timer = setTimeout(() => {
        setBoxStyle({
          left: `${mockFaceDetection.x}%`,
          top: `${mockFaceDetection.y}%`,
          width: `${mockFaceDetection.width}%`,
          height: `${mockFaceDetection.height}%`,
          opacity: 1,
          scale: 1,
        });
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setBoxStyle({
        left: "5%",
        top: "5%",
        width: "90%",
        height: "90%",
        opacity: 0,
        scale: 1.1,
      });
    }
  }, [isFaceDetectedOrLater]);

  // Simulation Status States mapping
  const statuses = [
    { id: 1, label: "Analyzing image", activeState: "scanning", stepLimit: 1 },
    { id: 2, label: "Detecting face", activeState: "scanning", stepLimit: 2 },
    { id: 3, label: "Face detected", activeState: "face_detected", stepLimit: 3 },
    { id: 4, label: "Generating visual signature", activeState: "face_encoding", stepLimit: 4 },
    { id: 5, label: "Face encoded", activeState: "face_encoded", stepLimit: 5 },
  ];

  const getStatusItemState = (item: typeof statuses[0]) => {
    if (isEncoded) return "completed";
    
    // Determine active index based on hook progress
    if (state === "scanning") {
      if (statusText === "Detecting face" && item.id === 1) return "completed";
      if (statusText === "Detecting face" && item.id === 2) return "active";
      if (statusText === "Analyzing image" && item.id === 1) return "active";
    } else if (state === "face_detected") {
      if (item.id < 3) return "completed";
      if (item.id === 3) return "active";
    } else if (state === "face_encoding") {
      if (item.id < 4) return "completed";
      if (item.id === 4) return "active";
    }
    
    // Fallback comparison
    if (item.activeState === state) return "active";
    
    const currentIndex = statuses.findIndex(s => s.activeState === state);
    const itemIndex = statuses.findIndex(s => s.id === item.id);
    if (currentIndex > itemIndex) return "completed";
    
    return "pending";
  };

  return (
    <section className="stage-view block animate-fadeIn" id="view-scanning">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        
        {/* ==================== LEFT COLUMN: CENTERPIECE SCAN IMAGE ==================== */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="relative w-80 h-96 sm:w-96 sm:h-[420px] rounded-3xl overflow-hidden bg-midnight-indigo/60 shadow-[0_0_50px_rgba(255,63,127,0.12)] border border-coral/15 transition-all duration-500">
            
            {/* Centerpiece portrait image */}
            <img 
              alt="Centerpiece scanning subject" 
              className={`w-full h-full object-cover select-none transition-all duration-1000 ${
                isFaceDetectedOrLater ? "blur-[0.5px] contrast-[1.02] brightness-90" : "blur-[2px] opacity-70"
              }`} 
              src={imageUrl} 
              referrerPolicy="no-referrer"
            />
            
            {/* Subtle radial/grid alignments overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ff3f7f_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
            {isFaceDetectedOrLater && (
              <div className="absolute inset-0 bg-[circle_at_center,rgba(255,111,145,0.02)_0%,transparent_60%] pointer-events-none animate-fadeIn"></div>
            )}

            {/* Glowing Horizontal Scanning Beam Sweep (only sweeps during scanning state) */}
            {!isFaceDetectedOrLater && (
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-hot-pink to-transparent shadow-[0_0_24px_4px_rgba(255,63,127,0.95)] animate-scan-beam z-10 pointer-events-none"></div>
            )}
            
            {/* Elastic Bounding Box */}
            {isFaceDetectedOrLater && (
              <div 
                className="absolute border border-coral rounded-2xl shadow-[0_0_30px_rgba(255,111,145,0.35)] transition-all duration-700 ease-out pointer-events-none z-20"
                style={{
                  left: boxStyle.left,
                  top: boxStyle.top,
                  width: boxStyle.width,
                  height: boxStyle.height,
                  opacity: boxStyle.opacity,
                  transform: `scale(${boxStyle.scale})`,
                }}
              >
                {/* Precision corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-hot-pink -mt-[1px] -ml-[1px] rounded-tl-md"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-hot-pink -mt-[1px] -mr-[1px] rounded-tr-md"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-hot-pink -mb-[1px] -ml-[1px] rounded-bl-md"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-hot-pink -mb-[1px] -mr-[1px] rounded-br-md"></div>
                
                {/* Coordinate Tag */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-deep-midnight/90 text-coral font-code-xs text-[9px] px-2 py-0.5 rounded border border-coral/30 tracking-wider font-mono">
                  LOCK: {(mockFaceDetection.confidence * 100).toFixed(1)}% CONF
                </div>

                {/* Glowing biometric face feature nodes */}
                <div className="absolute inset-0 opacity-80 animate-fadeIn">
                  {/* Eyes */}
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-hot-pink shadow-[0_0_8px_#ff3f7f] animate-pulse" style={{ left: "28%", top: "35%" }}></span>
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-hot-pink shadow-[0_0_8px_#ff3f7f] animate-pulse" style={{ left: "72%", top: "35%" }}></span>
                  {/* Nose */}
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-coral shadow-[0_0_8px_#ff6f91]" style={{ left: "50%", top: "54%" }}></span>
                  {/* Mouth */}
                  <span className="absolute w-1 h-1 rounded-full bg-soft-pink" style={{ left: "38%", top: "75%" }}></span>
                  <span className="absolute w-1 h-1 rounded-full bg-soft-pink" style={{ left: "62%", top: "75%" }}></span>
                  <span className="absolute w-1.5 h-1 rounded-full bg-coral shadow-[0_0_6px_#ff6f91]" style={{ left: "50%", top: "78%" }}></span>
                </div>
              </div>
            )}

            {/* Step status tag overlay */}
            <div className="absolute top-3 left-3 bg-deep-midnight/90 backdrop-blur-md px-3 py-1 rounded-full border border-coral/20 flex items-center gap-1.5 shadow-sm select-none">
              <span className="material-symbols-outlined text-coral text-[13px]">lens</span>
              <span className="font-code-xs text-[10px] font-semibold text-off-white font-mono uppercase tracking-wider">
                {badgeText}
              </span>
            </div>
            
          </div>
          
        </div>

        {/* ==================== RIGHT COLUMN: STATUS SEQUENCE & CONTROL DECK ==================== */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-deep-violet text-coral font-code-xs text-[11px] border border-coral/25 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-hot-pink animate-ping"></span>
              <span className="font-semibold tracking-wider">VISUAL SCANNING PIPELINE</span>
            </div>
            <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-off-white leading-tight">
              Analyzing visual structures...
            </h2>
            <p className="font-body-md text-sm text-muted-lavender leading-relaxed mt-1">
              Cnidaria is mapping geometric vector nodes to normalize facial landmark alignment.
            </p>
          </div>

          {/* Sequential Status messages container */}
          <div className="bg-midnight-indigo/90 rounded-2xl p-5 border border-coral/10 space-y-3.5 select-none shadow-[0_0_24px_rgba(0,0,0,0.2)]">
            {statuses.map(item => {
              const itemState = getStatusItemState(item);
              const isActive = itemState === "active";
              const isCompleted = itemState === "completed";

              return (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-deep-violet border border-coral/30 shadow-[0_0_12px_rgba(255,111,145,0.06)] scale-[1.01]" 
                      : "border border-transparent opacity-60"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs border transition-colors ${
                    isCompleted 
                      ? "bg-coral border-coral text-deep-midnight" 
                      : isActive 
                        ? "bg-deep-violet border-coral text-coral animate-pulse" 
                        : "bg-deep-midnight border-outline-variant/10 text-muted-lavender"
                  }`}>
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold">{item.id}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className={`font-sans text-xs font-semibold ${
                      isActive ? "text-coral" : isCompleted ? "text-off-white" : "text-muted-lavender/70"
                    }`}>
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtle Progress Bar */}
          <div className="space-y-1.5 select-none">
            <div className="flex justify-between items-center text-[11px] font-mono text-muted-lavender/80">
              <span>Embedding Engine</span>
              <span>
                {isEncoded ? "100%" : isEncodingOrLater ? "85%" : isFaceDetectedOrLater ? "50%" : "20%"}
              </span>
            </div>
            <div className="w-full bg-deep-violet rounded-full h-1 overflow-hidden border border-outline-variant/5">
              <div 
                className="bg-gradient-to-r from-hot-pink to-coral h-full transition-all duration-1000 ease-out" 
                style={{ width: isEncoded ? "100%" : isEncodingOrLater ? "85%" : isFaceDetectedOrLater ? "50%" : "20%" }}
              ></div>
            </div>
          </div>

          {/* ==================== COMPLETION & ACTION BAR ==================== */}
          <div className="pt-2 min-h-[50px] transition-all duration-500">
            {isEncoded ? (
              <div className="animate-fadeIn space-y-4">
                <div className="flex items-center gap-2 text-coral bg-deep-violet/40 border border-coral/25 rounded-xl px-4 py-3 select-none">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="font-sans text-xs font-semibold tracking-wide">
                    Ready to search the web
                  </span>
                </div>
                
                {/* Control deck for restarting or replacing */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button 
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-hot-pink to-coral text-off-white font-label-md text-xs font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all border-0 cursor-pointer"
                    onClick={onRestart}
                  >
                    Restart scan
                  </button>
                  <button 
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-outline hover:border-coral/40 hover:text-off-white text-muted-lavender font-label-md text-xs font-bold transition-all bg-transparent cursor-pointer"
                    onClick={onReset}
                  >
                    Choose another image
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-muted-lavender/60 italic font-mono select-none">
                * Simulated face landmark processing. No private biometric data is shared or transmitted.
              </p>
            )}
          </div>

        </div>
        
      </div>
    </section>
  );
};

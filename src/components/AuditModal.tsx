import React from "react";
import { BlockchainResponse, SearchResult } from "../types/pipeline";
import { AuditStepState } from "../hooks/usePipeline";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: AuditStepState[];
  result: BlockchainResponse | null;
  selectedResult: SearchResult | null;
  simulateTampering: boolean;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  steps,
  result,
  selectedResult,
  simulateTampering
}) => {
  if (!isOpen) return null;

  const localHash = simulateTampering 
    ? "a91f237bc901842bc1128394afbe128d9c284eef93cb109a823bf19a12bc900f" 
    : (selectedResult?.sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

  const onChainHash = selectedResult?.sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  return (
    <div className="fixed inset-0 z-50 bg-deep-midnight/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-midnight-indigo w-full max-w-md rounded-3xl p-6 border border-coral/15 shadow-[0_0_50px_rgba(255,63,127,0.1)] relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-deep-violet text-coral flex items-center justify-center border border-coral/15">
              <span className="material-symbols-outlined text-[18px]">lens</span>
            </div>
            <span className="font-sans text-base font-bold text-off-white">
              Integrity Verification
            </span>
          </div>
          <button 
            className="w-7 h-7 rounded-lg hover:bg-deep-violet text-muted-lavender hover:text-off-white flex items-center justify-center border-0 cursor-pointer bg-transparent focus:outline-none" 
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Live Steps List */}
        <div className="space-y-3 my-6 select-none" id="auditStepsList">
          {steps.map(step => {
            const isRunning = step.status === "running";
            const isCompleted = step.status === "completed";
            const isFailed = step.status === "failed";

            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                  isRunning 
                    ? "bg-deep-violet border-coral/30 shadow-[0_0_10px_rgba(255,111,145,0.05)]" 
                    : isCompleted 
                      ? "bg-deep-violet/40 border-coral/10" 
                      : isFailed 
                        ? "bg-hot-pink/10 border-hot-pink/30"
                        : "bg-deep-midnight/30 border-outline-variant/5 opacity-55"
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                  isRunning 
                    ? "bg-coral/25 border-coral text-coral" 
                    : isCompleted 
                      ? "bg-coral text-deep-midnight border-coral" 
                      : isFailed 
                        ? "bg-hot-pink text-deep-midnight border-hot-pink"
                        : "bg-deep-violet border-outline-variant/10 text-muted-lavender"
                }`}>
                  {isRunning ? (
                    <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                  ) : isCompleted ? (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  ) : isFailed ? (
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  ) : (
                    <span className="material-symbols-outlined text-[14px]">
                      {step.id === 2 ? "fingerprint" : "hub"}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <p className="font-label-md text-xs font-semibold text-off-white">
                    {step.label}
                  </p>
                  <p className="font-code-xs text-[10px] text-muted-lavender/80">
                    {step.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Success / Failure Details */}
        {result && (
          <div className="animate-fadeIn">
            {result.verified ? (
              /* Success Verified Box */
              <div className="mt-4 p-5 rounded-2xl bg-deep-violet/40 border border-coral/25 text-center" id="vSuccessResult">
                <div className="w-10 h-10 rounded-full bg-deep-violet text-coral border border-coral/30 mx-auto flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <h4 className="font-sans text-sm font-bold text-coral uppercase tracking-wider mb-1">
                  Asset Authentic
                </h4>
                <p className="font-body-sm text-xs text-muted-lavender mb-4">
                  Visual fingerprint matches original signature.
                </p>

                {/* Fingerprint proofs */}
                <div className="text-left space-y-2.5 font-mono text-[10px] bg-deep-midnight p-3 rounded-xl border border-coral/10 mb-4">
                  <div>
                    <span className="text-muted-lavender block uppercase tracking-wider text-[8px] font-bold mb-0.5">Local Fingerprint:</span>
                    <span className="text-off-white break-all select-all font-semibold">{localHash}</span>
                  </div>
                  <div>
                    <span className="text-muted-lavender block uppercase tracking-wider text-[8px] font-bold mb-0.5">Original Registered:</span>
                    <span className="text-off-white break-all select-all font-semibold">{onChainHash}</span>
                  </div>
                </div>

                <button 
                  className="w-full py-2.5 rounded-xl bg-deep-violet hover:bg-deep-violet/80 text-coral font-label-sm text-xs font-semibold cursor-pointer border border-coral/20"
                  onClick={onClose}
                >
                  Dismiss Verification
                </button>
              </div>
            ) : (
              /* Tampered Warning Box */
              <div className="mt-4 p-5 rounded-2xl bg-hot-pink/5 border border-hot-pink/30 text-center" id="vFailureResult">
                <div className="w-10 h-10 rounded-full bg-hot-pink/10 text-hot-pink mx-auto flex items-center justify-center mb-3 border border-hot-pink/25">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <h4 className="font-sans text-sm font-bold text-hot-pink uppercase tracking-wider mb-1">
                  Signature Mismatch
                </h4>
                <p className="font-body-sm text-xs text-muted-lavender mb-4">
                  Asset fingerprints do not match the registry state!
                </p>

                {/* Fingerprint Proofs exhibiting mismatch */}
                <div className="text-left space-y-2.5 font-mono text-[10px] bg-deep-midnight p-3 rounded-xl border border-hot-pink/15 mb-4">
                  <div>
                    <span className="text-hot-pink block uppercase tracking-wider text-[8px] font-bold mb-0.5">Computed Local Fingerprint:</span>
                    <span className="text-hot-pink font-bold break-all select-all p-1 bg-hot-pink/5 rounded block">{localHash}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-muted-lavender block uppercase tracking-wider text-[8px] font-bold mb-0.5">Original Registered:</span>
                    <span className="text-off-white break-all select-all block p-1 bg-deep-violet/50 rounded">{onChainHash}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button 
                    className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-hot-pink to-coral text-off-white font-label-sm text-xs font-semibold cursor-pointer border-0 shadow-md"
                    onClick={onClose}
                  >
                    Verify Again
                  </button>
                  <button 
                    className="w-1/2 py-2.5 rounded-xl bg-deep-violet text-muted-lavender hover:text-off-white font-label-sm text-xs font-semibold cursor-pointer border border-outline-variant/10"
                    onClick={onClose}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

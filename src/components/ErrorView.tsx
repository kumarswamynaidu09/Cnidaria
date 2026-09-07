import React from "react";
import { PipelineError } from "../types/pipeline";

interface ErrorViewProps {
  error: PipelineError | null;
  onReset: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onReset }) => {
  const displayError = error || {
    type: "api_error",
    message: "An unexpected error occurred.",
    suggestion: "Please try with another image or verify your connection."
  };

  const getIcon = () => {
    switch (displayError.type) {
      case "invalid_image":
        return "image_not_supported";
      case "no_face":
        return "face_retouching_off";
      case "multiple_faces":
        return "group_off";
      case "search_failed":
        return "travel_explore_off";
      case "no_results":
        return "search_off";
      case "verification_failed":
        return "gpp_maybe";
      default:
        return "error";
    }
  };

  return (
    <section className="stage-view block max-w-lg mx-auto text-center py-16 animate-fadeIn" id="view-error">
      <div className="bg-midnight-indigo rounded-3xl p-8 border border-coral/10 shadow-[0_0_30px_rgba(255,111,145,0.02)]">
        <div className="w-16 h-16 rounded-2xl bg-deep-violet text-coral mx-auto flex items-center justify-center mb-6 border border-coral/20">
          <span className="material-symbols-outlined text-[36px]">{getIcon()}</span>
        </div>
        
        <h2 className="font-display-lg text-2xl font-bold text-off-white mb-2 select-none">
          {displayError.message}
        </h2>
        
        {displayError.suggestion && (
          <p className="font-body-md text-sm text-muted-lavender mb-8 max-w-xs mx-auto select-none leading-relaxed">
            {displayError.suggestion}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 select-none">
          <button 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-hot-pink to-coral text-off-white font-label-md text-sm font-semibold hover:shadow-[0_0_15px_rgba(255,63,127,0.3)] hover:brightness-110 transition-all border-0 cursor-pointer" 
            onClick={onReset}
          >
            Back to upload viewfinder
          </button>
        </div>
      </div>
    </section>
  );
};

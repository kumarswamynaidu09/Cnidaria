import React, { useRef, useState } from "react";

interface UploadViewProps {
  onPresetSelect: (preset: "Elena" | "Marcus" | "Sofia") => void;
  onImageUpload: (dataUrl: string, name: string, sizeBytes: number) => void;
  onStartSearch: () => void;
  activePreset: "Elena" | "Marcus" | "Sofia";
  customImage: string | null;
  customName: string;
  customSize: string;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onImageUpload,
  onStartSearch,
  customImage,
  customName,
  customSize
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageUpload(event.target.result as string, file.name, file.size);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-space-xl px-4 animate-fadeIn">
      
      {!customImage ? (
        /* ==================== UPLOAD SCREEN ==================== */
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-space-xl">
            <h1 className="font-display-lg text-4xl sm:text-6xl text-off-white tracking-tight leading-tight mb-4 italic font-light">
              Discover the image's<br/>digital presence.
            </h1>
            <p className="font-body-lg text-muted-lavender max-w-md mx-auto text-base sm:text-lg">
              Upload an image to search publicly available visual content.
            </p>
          </div>

          {/* Large Gallery-Style Frame */}
          <div 
            className={`max-w-xl mx-auto relative rounded-3xl p-[1px] transition-all duration-500 ${
              dragActive 
                ? "bg-gradient-to-tr from-hot-pink via-coral to-lavender shadow-[0_0_40px_rgba(255,63,127,0.3)] scale-[1.01]" 
                : "bg-gradient-to-b from-outline-variant/20 to-outline-variant/5 hover:from-coral/20 hover:to-lavender/20 shadow-[0_0_24px_rgba(255,63,127,0.03)]"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div 
              className="bg-midnight-indigo/90 rounded-[31px] p-12 sm:p-20 text-center flex flex-col items-center justify-center cursor-pointer transition-all border border-transparent hover:border-coral/10 group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-14 h-14 rounded-full bg-deep-violet text-coral flex items-center justify-center mb-6 border border-coral/20 group-hover:scale-105 group-hover:border-coral group-hover:text-hot-pink transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">add</span>
              </div>
              
              <h3 className="font-headline-sm text-off-white font-medium text-lg mb-1 group-hover:text-coral transition-colors">
                Drop image here
              </h3>
              <p className="font-body-sm text-muted-lavender/80">
                or click to browse files
              </p>
              
              <input 
                ref={fileInputRef}
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
                type="file"
              />
            </div>
          </div>
        </div>
      ) : (
        /* ==================== IMAGE SELECTED STATE ==================== */
        <div className="text-center max-w-2xl mx-auto animate-fadeIn">
          <div className="mb-8">
            <h2 className="font-display-lg text-3xl sm:text-4xl text-off-white tracking-tight leading-tight mb-2">
              Ready for Visual Discovery
            </h2>
            <p className="font-body-md text-muted-lavender">
              Analyze the digital footprint of your loaded asset.
            </p>
          </div>

          {/* Large centered image container with coral pink subtle glow */}
          <div className="relative inline-block rounded-2xl overflow-hidden border border-coral/20 shadow-[0_0_40px_rgba(255,111,145,0.15)] mb-8 bg-midnight-indigo/40 p-2">
            <img 
              alt="Uploaded centerpiece preview" 
              className="max-h-96 w-auto object-contain rounded-xl" 
              src={customImage} 
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-code-xs text-muted-lavender uppercase tracking-widest text-[10px] mb-1">Asset Information</p>
              <h4 className="font-headline-sm text-lg font-medium text-off-white truncate max-w-md mx-auto select-all">
                {customName}
              </h4>
              <p className="font-code-xs text-muted-lavender/80 font-mono mt-0.5">{customSize}</p>
            </div>

            {/* Substantial, elegant button groupings */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto pt-2">
              <button 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-hot-pink to-coral text-off-white font-label-md font-semibold shadow-md shadow-hot-pink/10 hover:shadow-[0_0_24px_rgba(255,63,127,0.3)] hover:brightness-110 active:scale-[0.98] transition-all border-0 cursor-pointer text-center"
                onClick={onStartSearch}
              >
                Search the web
              </button>
              <button 
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-outline hover:border-coral/50 hover:text-off-white text-muted-lavender font-label-md font-semibold transition-all bg-transparent cursor-pointer text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose another image
              </button>
            </div>
          </div>
          
          <input 
            ref={fileInputRef}
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
            type="file"
          />
        </div>
      )}
      
    </div>
  );
};

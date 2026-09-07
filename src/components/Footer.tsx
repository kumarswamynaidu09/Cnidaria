import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-deep-midnight border-t border-outline-variant/10 py-10 mt-space-3xl select-none">
      <div className="w-full max-w-container-max mx-auto px-gutter-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-sans text-lg font-bold tracking-widest text-off-white uppercase">Cnidaria</span>
          <span className="hidden sm:inline text-outline-variant/40">•</span>
          <p className="font-body-sm text-body-sm text-muted-lavender">
            Visual discovery + content provenance
          </p>
        </div>
        
        <nav className="flex items-center gap-6">
          <a 
            className="font-label-sm text-label-sm text-muted-lavender hover:text-off-white transition-colors hover:underline" 
            href="https://github.com/kumarswamynaidu09/Cnidaria" 
            target="_blank" 
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
};

import React from "react";

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-deep-midnight/80 backdrop-blur-md border-b border-outline-variant/20 sticky top-0 z-40">
      <div className="w-full max-w-container-max mx-auto px-gutter-desktop h-16 flex items-center justify-between">
        
        {/* Brand & Abstract Organic Logo */}
        <button 
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none bg-transparent border-0" 
          onClick={onReset}
        >
          <div className="w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" className="stroke-lavender/30" />
              <path d="M12 3c-1.5 1.5-2 3.5-2 5.5s.5 4 2 5.5c1.5-1.5 2-3.5 2-5.5s-.5-4-2-5.5z" className="stroke-coral" />
              <path d="M12 8c-1 1-1.5 2.2-1.5 3.5s.5 2.5 1.5 3.5c1-1 1.5-2.2 1.5-3.5S13 9 12 8z" className="stroke-hot-pink" />
              <circle cx="12" cy="12" r="1.5" className="fill-blush stroke-none" />
              <path d="M4 12h2M18 12h2M12 4v2M12 18v2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42" className="stroke-lavender/60" strokeWidth="1.25" />
            </svg>
          </div>
          <span className="font-sans text-xl font-bold tracking-wider text-off-white uppercase">
            Cnidaria
          </span>
        </button>

        {/* Minimal Navigation */}
        <nav className="flex items-center gap-6">
          <a 
            className="font-label-md text-label-md text-muted-lavender hover:text-off-white transition-colors cursor-pointer" 
            href="#about"
          >
            About
          </a>
          <a 
            className="font-label-md text-label-md text-muted-lavender hover:text-off-white transition-colors cursor-pointer" 
            href="#how-it-works"
          >
            How it works
          </a>
          <a 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-deep-violet hover:bg-deep-violet/80 border border-coral/20 text-off-white text-xs font-semibold transition-colors" 
            href="https://github.com/kumarswamynaidu09/Cnidaria" 
            target="_blank" 
            rel="noreferrer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </nav>

      </div>
    </header>
  );
};

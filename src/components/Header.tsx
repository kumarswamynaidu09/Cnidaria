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
        <nav className="flex items-center gap-8">
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
        </nav>

      </div>
    </header>
  );
};

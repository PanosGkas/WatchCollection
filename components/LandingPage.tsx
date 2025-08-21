import React, { useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

interface LandingPageProps {
  onNavigateToCollection: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToCollection }) => {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const maskCircleRef = useRef<SVGCircleElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  // Raw position of the mouse in viewport coordinates
  const viewportMousePos = useRef({ x: -999, y: -999 });
  // Smoothed (lagging) position of the spotlight in viewport coordinates
  const smoothedViewportMousePos = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Update the target position for the spotlight
      viewportMousePos.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animate = () => {
      // A smaller smoothing factor creates more lag, making the follower feel heavier
      const smoothingFactor = 0.05;
      
      // 1. Calculate the smoothed position for the visible spotlight div
      smoothedViewportMousePos.current.x += (viewportMousePos.current.x - smoothedViewportMousePos.current.x) * smoothingFactor;
      smoothedViewportMousePos.current.y += (viewportMousePos.current.y - smoothedViewportMousePos.current.y) * smoothingFactor;
      
      // Apply the position to the visible spotlight
      if (cursorFollowerRef.current) {
        cursorFollowerRef.current.style.left = `${smoothedViewportMousePos.current.x}px`;
        cursorFollowerRef.current.style.top = `${smoothedViewportMousePos.current.y}px`;
      }

      // 2. Use the spotlight's smoothed position to drive the SVG mask
      if (svgRef.current && maskCircleRef.current) {
        const svg = svgRef.current;
        const svgRect = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;

        if (svgRect.width > 0 && svgRect.height > 0) {
          const sourceX = smoothedViewportMousePos.current.x;
          const sourceY = smoothedViewportMousePos.current.y;
          const relativeX = sourceX - svgRect.left;
          const relativeY = sourceY - svgRect.top;
          const svgX = (relativeX / svgRect.width) * viewBox.width;
          const svgY = (relativeY / svgRect.height) * viewBox.height;
          
          maskCircleRef.current.setAttribute('cx', String(svgX));
          maskCircleRef.current.setAttribute('cy', String(svgY));
        }
      }

      // 3. Check for interaction with the button
      if (buttonRef.current) {
        const button = buttonRef.current;
        const buttonRect = button.getBoundingClientRect();
        const { x, y } = smoothedViewportMousePos.current;

        const isOverButton = x > buttonRect.left && x < buttonRect.right && y > buttonRect.top && y < buttonRect.bottom;

        if (isOverButton) {
          const relativeX = x - buttonRect.left;
          const relativeY = y - buttonRect.top;
          const hotColor = theme === 'dark' ? '#FBBF24' : '#22d3ee';
          const baseColor = theme === 'dark' ? '#f59e0b' : '#0891b2';
          
          button.style.backgroundImage = `radial-gradient(circle at ${relativeX}px ${relativeY}px, ${hotColor}, ${baseColor})`;
        } else {
          button.style.backgroundImage = '';
        }
      }

      // 4. Update spotlight for subtitle glow
      if (subtitleRef.current) {
        const subtitle = subtitleRef.current;
        const subtitleRect = subtitle.getBoundingClientRect();
        const { x, y } = smoothedViewportMousePos.current;

        const relativeX = x - subtitleRect.left;
        const relativeY = y - subtitleRect.top;
        
        subtitle.style.setProperty('--spotlight-x', `${relativeX}px`);
        subtitle.style.setProperty('--spotlight-y', `${relativeY}px`);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Rerun effect if theme changes to update button colors

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-transparent overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Visible Cursor Follower (The Spotlight) */}
      <div
        ref={cursorFollowerRef}
        className="absolute top-0 left-0 w-72 h-72 rounded-full bg-amber-300/50 dark:bg-cyan-300/50 blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
      ></div>

      {/* Main Content */}
      <div className="relative z-20 text-center p-8 sm:p-12 lg:p-16 animate-fade-in-up w-full max-w-5xl flex flex-col items-center bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-zinc-700/60 shadow-2xl">
        {/* SVG container for the liquid fill effect */}
        <svg ref={svgRef} className="w-full cursor-default" viewBox="0 0 1200 300">
          <defs>
            <mask id="liquidMask">
              {/* This rectangle is the base of the mask (all black = hides content) */}
              <rect width="100%" height="100%" fill="black" />
              {/* This circle is the white part of the mask that reveals content */}
              <circle ref={maskCircleRef} r="150" fill="white" />
            </mask>
          </defs>

          {/* Base Text: The outline (always visible) */}
          <text
            x="50%"
            y="50%"
            dy="0.35em"
            textAnchor="middle"
            className="text-8xl sm:text-9xl font-bold tracking-tight font-serif fill-transparent stroke-cyan-800 dark:stroke-amber-400"
            strokeWidth="2"
          >
            Clé du Temps
          </text>

          {/* Top Text: The fill, revealed by the mask */}
          <text
            x="50%"
            y="50%"
            dy="0.35em"
            textAnchor="middle"
            className="text-8xl sm:text-9xl font-bold tracking-tight font-serif fill-cyan-800 dark:fill-amber-400"
            mask="url(#liquidMask)"
          >
            Clé du Temps
          </text>
        </svg>

        <div ref={subtitleRef} className="relative mt-4 max-w-2xl mx-auto cursor-default">
            {/* Base text */}
            <p className="text-lg sm:text-xl text-zinc-700 dark:text-stone-300 font-medium">
              Discover a curated collection of the world's finest timepieces. A symphony of craftsmanship and timeless elegance awaits.
            </p>
            {/* Glowing text on top, revealed by mask */}
            <p
              className="glowing-text absolute top-0 left-0 w-full h-full text-lg sm:text-xl font-medium text-cyan-600 dark:text-amber-400 pointer-events-none"
              aria-hidden="true"
            >
              Discover a curated collection of the world's finest timepieces. A symphony of craftsmanship and timeless elegance awaits.
            </p>
        </div>
        <button
          ref={buttonRef}
          onClick={onNavigateToCollection}
          className="mt-10 px-10 py-4 font-semibold text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out backdrop-blur-md border text-cyan-900 dark:text-amber-100 bg-cyan-600/20 dark:bg-amber-500/20 border-cyan-600/30 dark:border-amber-500/30 hover:bg-cyan-600/40 dark:hover:bg-amber-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 dark:focus:ring-amber-500/50"
        >
          See The Collection
        </button>
      </div>

      {/* Styling for animation and responsive SVG text */}
      <style>{`
        .glowing-text {
          text-shadow: 0 0 16px rgba(14, 165, 233, 0.6); /* cyan-500 based */
          mask-image: radial-gradient(circle 150px at var(--spotlight-x) var(--spotlight-y), black, transparent);
          -webkit-mask-image: radial-gradient(circle 150px at var(--spotlight-x) var(--spotlight-y), black, transparent);
        }

        .dark .glowing-text {
          text-shadow: 0 0 16px rgba(251, 191, 36, 0.6); /* amber-400 based */
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        /* Replicate Tailwind's responsive text sizes for SVG since classes don't work */
        svg .text-8xl { font-size: 6rem; }
        @media (min-width: 640px) {
          svg .sm\\:text-9xl { font-size: 8rem; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

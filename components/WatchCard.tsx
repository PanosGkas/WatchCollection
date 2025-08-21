// If you don't want short preview just use the file WatchCard-original

import React, { useState } from 'react';
import { Watch } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface WatchCardProps {
  watch: Watch;
  onSelect: () => void;
}

const WatchCard: React.FC<WatchCardProps> = ({ watch, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? watch.imageUrls.length - 1 : prevIndex - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === watch.imageUrls.length - 1 ? 0 : prevIndex + 1));
  };
  
  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  }

  return (
    <div
      className="bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border border-white/30 dark:border-zinc-700/50 cursor-pointer group"
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${watch.brand} ${watch.model}`}
    >
      <div className="relative aspect-square overflow-hidden" aria-live="polite" aria-atomic="true">
        <img
          key={watch.imageUrls[currentIndex]} // Key change triggers re-render and animation
          src={watch.imageUrls[currentIndex]}
          alt={`${watch.brand} ${watch.model} - image ${currentIndex + 1} of ${watch.imageUrls.length}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 animate-fade-in"
        />
        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:left-full transition-all duration-700 ease-in-out"></div>
        
        {watch.imageUrls.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            
            {/* Image Indicator Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {watch.imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleDotClick(e, index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'bg-white/90 scale-125' : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold text-cyan-800 dark:text-amber-400 tracking-wider uppercase">{watch.brand}</p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 truncate">{watch.model}</h3>
        <p className="text-md font-mono text-slate-800 dark:text-slate-200 mt-2">{watch.price}</p>
      </div>
    </div>
  );
};

export default WatchCard;
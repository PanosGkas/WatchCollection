import React, {useState} from 'react';
import { Watch } from '../types';

// Image Preview Arrow
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';


interface WatchCardProps {
  watch: Watch;
  onSelect: () => void;
}

const WatchCard: React.FC<WatchCardProps> = ({ watch, onSelect }) => {
  return (
    <div
      className="bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border border-white/30 dark:border-zinc-700/50 cursor-pointer group"
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${watch.brand} ${watch.model}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={watch.imageUrls[0]}
          alt={`${watch.brand} ${watch.model}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:left-full transition-all duration-700 ease-in-out"></div>
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
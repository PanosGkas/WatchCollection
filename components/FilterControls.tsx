import React, { useState, useRef, useEffect, useCallback } from 'react';
import FilterIcon from './icons/FilterIcon';

interface FilterControlsProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: { min: number; max: number };
  onPriceChange: (range: { min: number; max: number }) => void;
  onReset: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  brands,
  selectedBrand,
  onBrandChange,
  minPrice,
  maxPrice,
  priceRange,
  onPriceChange,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), priceRange.max - 1);
    onPriceChange({ ...priceRange, min: value });
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), priceRange.min + 1);
    onPriceChange({ ...priceRange, max: value });
  };

  const minPos = ((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPos = ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100;

  const sliderThumbStyles = `
    [&::-webkit-slider-thumb]:h-5
    [&::-webkit-slider-thumb]:w-5
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:shadow-md
    [&::-webkit-slider-thumb]:cursor-pointer
    [&::-webkit-slider-thumb]:pointer-events-auto
    [&::-webkit-slider-thumb]:ring-2
    [&::-webkit-slider-thumb]:ring-cyan-600
    [&::-webkit-slider-thumb]:dark:ring-amber-500
    [&::-moz-range-thumb]:h-5
    [&::-moz-range-thumb]:w-5
    [&::-moz-range-thumb]:appearance-none
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-white
    [&::-moz-range-thumb]:shadow-md
    [&::-moz-range-thumb]:cursor-pointer
    [&::-moz-range-thumb]:pointer-events-auto
    [&::-moz-range-thumb]:border-2
    [&::-moz-range-thumb]:border-cyan-600
    [&::-moz-range-thumb]:dark:border-amber-500
  `;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 dark:border-zinc-600/50 bg-white/20 dark:bg-black/20 backdrop-blur-lg text-slate-800 dark:text-slate-100 hover:bg-white/50 dark:hover:bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-zinc-900 transition-all"
        aria-expanded={isOpen}
        aria-controls="filter-panel"
      >
        <FilterIcon className="w-5 h-5" />
        <span className="font-medium">Filter</span>
      </button>

      {isOpen && (
        <div
          id="filter-panel"
          className="absolute top-full right-0 mt-2 w-72 origin-top-right bg-white/20 dark:bg-zinc-800/40 backdrop-blur-2xl border border-white/30 dark:border-zinc-700/60 rounded-xl shadow-2xl z-10 p-4"
        >
          <div className="space-y-6">
            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-slate-800 dark:text-slate-100">
                  Price Range
                </label>
                <span className="text-sm font-mono text-cyan-800 dark:text-amber-400">
                  ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
                </span>
              </div>
              <div className="relative pt-2 h-10 flex items-center">
                <div className="relative w-full h-2">
                  <div className="absolute top-0 h-2 w-full rounded-full bg-slate-300 dark:bg-zinc-600"></div>
                  <div 
                    className="absolute top-0 h-2 rounded-full bg-cyan-600 dark:bg-amber-500"
                    style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
                  ></div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step="1"
                    value={priceRange.min}
                    onChange={handleMinChange}
                    className={`absolute top-0 w-full h-2 appearance-none bg-transparent pointer-events-none ${sliderThumbStyles}`}
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step="1"
                    value={priceRange.max}
                    onChange={handleMaxChange}
                    className={`absolute top-0 w-full h-2 appearance-none bg-transparent pointer-events-none ${sliderThumbStyles}`}
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Brand</h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} htmlFor={`brand-${brand}`} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      id={`brand-${brand}`}
                      name="brand-filter"
                      value={brand}
                      checked={selectedBrand === brand}
                      onChange={() => onBrandChange(brand)}
                      className="h-4 w-4 text-cyan-600 dark:text-amber-500 border-slate-400 dark:border-zinc-500 focus:ring-cyan-500 dark:focus:ring-amber-500 bg-transparent"
                    />
                    <span className="text-slate-700 dark:text-slate-200">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                onReset();
                setIsOpen(false); // Optionally close panel on reset
              }}
              className="w-full text-center px-4 py-2 text-sm font-medium rounded-md border border-slate-400/80 dark:border-zinc-600/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-zinc-700/50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
      </div>
      <input
        type="search"
        name="search"
        id="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-xl border-white/30 dark:border-zinc-600/50 bg-white/20 dark:bg-black/20 backdrop-blur-lg py-2 pl-10 pr-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 dark:focus:ring-amber-500 sm:text-sm sm:leading-6 transition-all duration-300"
        placeholder="Search by brand or model..."
        aria-label="Search watches"
      />
    </div>
  );
};

export default SearchBar;
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import WatchCard from './components/WatchCard';
import { WATCHES } from './constants';
import { Watch } from './types';
import WatchDetailModal from './components/WatchDetailModal';
import FilterControls from './components/FilterControls';
import SearchBar from './components/SearchBar';
import LandingPage from './components/LandingPage';

const parsePrice = (priceStr: string): number => {
  return parseInt(priceStr.replace(/[^0-9]/g, ''));
};

const AnimatedBackground: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
    <div className="gradient-bg-ball ball-1"></div>
    <div className="gradient-bg-ball ball-2"></div>
    <div className="gradient-bg-ball ball-3"></div>
  </div>
);


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'collection'>('landing');
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const brands = useMemo(() => ['All', ...new Set(WATCHES.map(watch => watch.brand))], []);

  const { minPrice, maxPrice } = useMemo(() => {
    if (WATCHES.length === 0) {
      return { minPrice: 0, maxPrice: 10000 };
    }
    const prices = WATCHES.map(w => parsePrice(w.price));
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, []);

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  
  // Effect to reset the price range if the base min/max from data ever changes.
  useEffect(() => {
    setPriceRange({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);


  useEffect(() => {
    // Only apply overflow lock if on the collection page
    if (currentPage === 'collection') {
        if (selectedWatch) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedWatch, currentPage]);

  const handleSelectWatch = (watch: Watch) => {
    setSelectedWatch(watch);
  };

  const handleCloseModal = () => {
    setSelectedWatch(null);
  };
  
  const handleResetFilters = () => {
    setSelectedBrand('All');
    setPriceRange({ min: minPrice, max: maxPrice });
    setSearchQuery('');
  };

  const filteredWatches = useMemo(() => WATCHES.filter(watch => {
    const brandMatch = selectedBrand === 'All' || watch.brand === selectedBrand;
    const watchPrice = parsePrice(watch.price);
    const priceMatch = watchPrice >= priceRange.min && watchPrice <= priceRange.max;
    const searchMatch = searchQuery.trim() === '' ||
      watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.model.toLowerCase().includes(searchQuery.toLowerCase());
      
    return brandMatch && priceMatch && searchMatch;
  }), [selectedBrand, priceRange, searchQuery]);

  const handleNavigateToCollection = () => {
    setCurrentPage('collection');
  };

  if (currentPage === 'landing') {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 font-sans">
            <AnimatedBackground />
            <LandingPage onNavigateToCollection={handleNavigateToCollection} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300 font-sans">
      <AnimatedBackground />
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex-grow">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <FilterControls
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            onReset={handleResetFilters}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWatches.map(watch => (
            <WatchCard key={watch.id} watch={watch} onSelect={() => handleSelectWatch(watch)} />
          ))}
        </div>
        {filteredWatches.length === 0 && (
          <div className="text-center py-16 text-slate-800 dark:text-zinc-200 col-span-full bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl border border-white/30 dark:border-zinc-700/50">
            <h2 className="text-2xl font-semibold">No Watches Found</h2>
            <p className="mt-2">Try adjusting your filters or search to find what you're looking for.</p>
          </div>
        )}
      </main>
      <footer className="text-center py-8 text-slate-700 dark:text-zinc-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Clé du Temps. All rights reserved.</p>
        <p>A demonstration of fine watchmaking and elegant web design.</p>
      </footer>
      <WatchDetailModal
        watch={selectedWatch}
        onClose={handleCloseModal}
        onSelectWatch={handleSelectWatch}
      />
    </div>
  );
};

export default App;
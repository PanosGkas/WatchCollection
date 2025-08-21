import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 py-4 px-4 sm:px-6 lg:px-8 bg-white/20 dark:bg-zinc-900/30 backdrop-blur-xl border-b border-white/30 dark:border-zinc-700/60 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-cyan-800 dark:text-amber-400 font-serif">
            Clé du Temps
          </h1>
          <img src={"WatchCollection/images/logo1size.png"} width={"50px"} height={"50px"} className="filter hue-rotate-180 contrast-100 drop-shadow-xl dark:filter-none dark:drop-shadow-xl dark:contrast-100 "/>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
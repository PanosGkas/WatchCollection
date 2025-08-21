import React, { useState, useEffect } from 'react';
import { Watch } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { WATCHES } from '../constants';
import WatchCard from './WatchCard';
import LoadingSpinner from './icons/LoadingSpinner';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface WatchDetailModalProps {
  watch: Watch | null;
  onClose: () => void;
  onSelectWatch: (watch: Watch) => void;
}

const WatchDetailModal: React.FC<WatchDetailModalProps> = ({ watch, onClose, onSelectWatch }) => {
  const [mainImage, setMainImage] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [isFindingSimilar, setIsFindingSimilar] = useState(false);
  const [similarWatches, setSimilarWatches] = useState<Watch[]>([]);
  const [findError, setFindError] = useState<string | null>(null);

  useEffect(() => {
    if (watch) {
      setMainImage(watch.imageUrls[0]);
      setSimilarWatches([]);
      setFindError(null);
      const timer = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timer);
    }
  }, [watch]);

  const handleClose = () => {
    setShowContent(false);
    const timer = setTimeout(onClose, 200);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const findSimilarWatches = async () => {
    if (!watch) return;
    setIsFindingSimilar(true);
    setFindError(null);
    setSimilarWatches([]);
    try {
      const otherWatches = WATCHES.filter(w => w.id !== watch.id).map(
        ({ id, brand, model, description, caseMaterial, strapMaterial, dialColor, price }) => 
        ({ id, brand, model, description, caseMaterial, strapMaterial, dialColor, price })
      );
      
      const prompt = `Given the main watch: ${JSON.stringify({ brand: watch.brand, model: watch.model, description: watch.description, price: watch.price })}. And the following list of available watches: ${JSON.stringify(otherWatches)}. Identify the three most similar watches from the list based on style, brand, features, and price. Return only a JSON object.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              similar_watch_ids: {
                type: Type.ARRAY,
                description: 'An array of three numbers, where each number is the ID of a similar watch.',
                items: { type: Type.NUMBER }
              }
            }
          }
        }
      });
      
      const resultJson = JSON.parse(response.text);
      const similarIds = resultJson.similar_watch_ids;
      
      if (!similarIds || !Array.isArray(similarIds) || similarIds.length === 0) {
        throw new Error('AI did not return valid watch IDs.');
      }
      const foundWatches = WATCHES.filter(w => similarIds.includes(w.id));
      setSimilarWatches(foundWatches);
    } catch (error) {
      console.error('Error finding similar watches:', error);
      setFindError('Sorry, we couldn\'t find similar watches at this time.');
    } finally {
      setIsFindingSimilar(false);
    }
  };

  if (!watch) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-out ${showContent ? 'opacity-100' : 'opacity-0'} bg-black/50 backdrop-blur-md`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="watch-modal-title"
    >
      <div
        className={`transform transition-all duration-300 ease-out ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'} relative bg-white/50 dark:bg-zinc-800/60 backdrop-blur-2xl border border-white/20 dark:border-zinc-700/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white z-20 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-grow overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-x-8">
            <div className="p-4 sm:p-6 flex flex-col md:sticky top-0">
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-inner">
                <img src={mainImage} alt={`${watch.brand} ${watch.model}`} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-center space-x-3">
                {watch.imageUrls.map((url, index) => (
                  <button key={index} onClick={() => setMainImage(url)} className={`w-16 h-16 rounded-md overflow-hidden ring-2 ring-offset-2 dark:ring-offset-zinc-800 transition-all ${mainImage === url ? 'ring-cyan-600 dark:ring-amber-400' : 'ring-transparent hover:ring-slate-400 dark:hover:ring-zinc-500'}`} aria-label={`View image ${index + 1}`}>
                    <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col">
              <p className="text-sm font-semibold text-cyan-800 dark:text-amber-400 tracking-wider uppercase">{watch.brand}</p>
              <h3 id="watch-modal-title" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">{watch.model}</h3>
              <div className="my-6 space-y-4 text-slate-700 dark:text-slate-200 text-sm">
                <div className="flex justify-between items-center text-lg border-t border-slate-300/70 dark:border-zinc-700/70 pt-4">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Price</span>
                  <span className="font-mono text-cyan-800 dark:text-amber-400">{watch.price}</span>
                </div>
                <p className="leading-relaxed border-t border-slate-300/70 dark:border-zinc-700/70 pt-4">{watch.description}</p>
                <div className="space-y-2 border-t border-slate-300/70 dark:border-zinc-700/70 pt-4">
                  <div className="flex justify-between"><span className="font-semibold text-slate-800 dark:text-slate-100">Case</span><span>{watch.caseMaterial}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-800 dark:text-slate-100">Strap</span><span>{watch.strapMaterial}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-800 dark:text-slate-100">Dial</span><span>{watch.dialColor}</span></div>
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-slate-300/70 dark:border-zinc-700/70">
                <button onClick={findSimilarWatches} disabled={isFindingSimilar} className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-700 hover:bg-cyan-800 dark:bg-amber-500 dark:hover:bg-amber-600 disabled:bg-slate-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors">
                  {isFindingSimilar ? (<><LoadingSpinner className="w-5 h-5 mr-3" />Searching...</>) : 'Find Similar Watches'}
                </button>
              </div>
            </div>
          </div>
          
          {(similarWatches.length > 0 || findError) && (
            <div className="p-4 sm:p-6 border-t-2 border-slate-300/70 dark:border-zinc-700/70 mt-4">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Similar Recommendations</h4>
              {findError ? (
                 <p className="text-center text-red-500 dark:text-red-400">{findError}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {similarWatches.map(sw => (
                    <WatchCard key={sw.id} watch={sw} onSelect={() => onSelectWatch(sw)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchDetailModal;
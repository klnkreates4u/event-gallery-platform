'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, X, Heart } from 'lucide-react';

export interface FavoritesDownloadBarProps {
  favoritesCount: number;
  onClearFavorites: () => void;
  onDownloadFavorites: () => void;
  isDownloading: boolean;
}

export function FavoritesDownloadBar({
  favoritesCount,
  onClearFavorites,
  onDownloadFavorites,
  isDownloading,
}: FavoritesDownloadBarProps) {
  const [prevCount, setPrevCount] = useState(favoritesCount);
  const [countChanged, setCountChanged] = useState(false);

  // Pulse the count badge when it changes
  useEffect(() => {
    if (favoritesCount !== prevCount) {
      setCountChanged(true);
      setPrevCount(favoritesCount);
      const t = setTimeout(() => setCountChanged(false), 400);
      return () => clearTimeout(t);
    }
  }, [favoritesCount, prevCount]);

  return (
    <AnimatePresence>
      {favoritesCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0,  x: '-50%' }}
          exit={{ opacity: 0, y: 40,  x: '-50%' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 z-40"
          style={{ translateX: '-50%' }}
        >
          {/* Pill container */}
          <div className="bg-cherry text-white px-4 py-3 rounded-pill shadow-cherry shadow-xl flex items-center gap-3 border border-white/10 backdrop-blur-sm">
            
            {/* Heart + count */}
            <div className="flex items-center gap-2 pl-1">
              <Heart className="w-4 h-4 fill-current text-candy" />
              <div
                className={`flex h-6 min-w-[1.5rem] px-1.5 items-center justify-center rounded-full bg-white text-cherry text-xs font-bold transition-transform ${countChanged ? 'heart-popping' : ''}`}
              >
                {favoritesCount}
              </div>
              <span className="text-sm font-medium text-white/90">
                {favoritesCount === 1 ? 'Favorite' : 'Favorites'}
              </span>
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-white/20" />

            {/* Download button with shine */}
            <button
              onClick={onDownloadFavorites}
              disabled={isDownloading}
              className="relative flex items-center gap-1.5 text-sm font-semibold text-white hover:text-candy transition-colors disabled:opacity-60 btn-shine overflow-hidden px-1 py-1 rounded-lg"
              type="button"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? 'Packaging…' : 'Download ZIP'}
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-white/20" />

            {/* Clear button */}
            <button
              onClick={onClearFavorites}
              className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-white/60 hover:text-white"
              title="Clear all favorites"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

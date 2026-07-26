'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { MediaItem } from '@/types';

export interface FullscreenViewerProps {
  items: MediaItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onOpenDownload: (media: MediaItem) => void;
  onOpenShare: (media: MediaItem) => void;
}

export function FullscreenViewer({
  items,
  currentIndex,
  onClose,
  onNavigate,
  onOpenDownload,
  onOpenShare,
}: FullscreenViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const activeItem = currentIndex !== null ? items[currentIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    if (currentIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, items, onNavigate, onClose]);

  if (currentIndex === null || !activeItem) return null;

  const handlePrev = () => {
    setIsZoomed(false);
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setIsZoomed(false);
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-black/95 backdrop-blur-xl select-none">
        {/* Top Header Control Bar */}
        <div className="absolute top-0 inset-x-0 z-20 p-6 flex items-center justify-between text-white bg-gradient-to-b from-primary-black/80 to-transparent">
          {/* Counter Badge */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-mono tracking-wider">
              {currentIndex + 1} / {items.length}
            </span>
            <span className="hidden sm:inline text-sm font-editorial text-white/90">
              {activeItem.title}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {activeItem.type === 'photo' && (
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                type="button"
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => onOpenShare(activeItem)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="Share"
              type="button"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenDownload(activeItem)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="Download"
              type="button"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="Close"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-105"
          title="Previous"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-105"
          title="Next"
          type="button"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Media Container */}
        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: isZoomed ? 1.4 : 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative max-w-5xl max-h-[85vh] p-4 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {activeItem.type === 'photo' ? (
            <img
              src={activeItem.url}
              alt={activeItem.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
            />
          ) : (
            <div className="relative max-w-full max-h-[80vh] overflow-hidden rounded-lg shadow-2xl">
              <video
                controls
                autoPlay
                className="max-w-full max-h-[80vh] object-contain"
                src={activeItem.url}
                poster={activeItem.thumbnailUrl}
              >
                Your browser does not support HTML5 video.
              </video>
            </div>
          )}
        </motion.div>

        {/* Bottom Details Bar */}
        {activeItem.caption && (
          <div className="absolute bottom-6 inset-x-0 z-20 text-center px-6">
            <p className="inline-block px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-xs text-white/90 max-w-md truncate">
              {activeItem.caption}
            </p>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}

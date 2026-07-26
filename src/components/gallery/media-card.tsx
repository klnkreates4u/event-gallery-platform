'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Share2, Heart, Maximize2 } from 'lucide-react';
import { MediaItem } from '@/types';

export interface MediaCardProps {
  media: MediaItem;
  index: number;
  onOpenFullscreen: (index: number) => void;
  onOpenDownload: (media: MediaItem) => void;
  onOpenShare: (media: MediaItem) => void;
}

export function MediaCard({
  media,
  index,
  onOpenFullscreen,
  onOpenDownload,
  onOpenShare,
}: MediaCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Aspect ratio height styling
  const aspectClass =
    media.aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : media.aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[4/3]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className={`group relative rounded-gallery overflow-hidden bg-neutral-900 border border-warm-ivory dark:border-neutral-800 shadow-md ${aspectClass}`}
    >
      {/* Thumbnail Image */}
      <img
        src={media.thumbnailUrl || media.url}
        alt={media.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Video Play Overlay Icon */}
      {media.type === 'video' && (
        <div
          onClick={() => onOpenFullscreen(index)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-primary-black/30 group-hover:bg-primary-black/50 transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-neutral-900/90 text-velvet-red flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
          {media.durationSeconds && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/75 text-[11px] font-mono text-white">
              0:{media.durationSeconds < 10 ? `0${media.durationSeconds}` : media.durationSeconds}
            </span>
          )}
        </div>
      )}

      {/* Top Left Badge (Media Number & Category) */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        <span className="px-2.5 py-1 rounded-full bg-primary-black/70 backdrop-blur-md text-[10px] font-semibold text-white tracking-wider uppercase">
          #{index + 1}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] text-white font-medium">
          {media.category}
        </span>
      </div>

      {/* Favorite Button (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isFavorite ? 'bg-velvet-red text-white' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70'
        }`}
        title="Favorite"
        type="button"
      >
        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Bottom Overlay Info & Controls */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 bg-gradient-to-t from-primary-black/90 via-primary-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between text-white">
        <div className="space-y-0.5 max-w-[65%] cursor-pointer" onClick={() => onOpenFullscreen(index)}>
          <h4 className="font-editorial text-sm font-semibold truncate">{media.title}</h4>
          {media.caption && <p className="text-[11px] text-white/70 truncate">{media.caption}</p>}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenShare(media)}
            className="p-2 rounded-button bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
            title="Share"
            type="button"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenDownload(media)}
            className="p-2 rounded-button bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
            title="Download"
            type="button"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenFullscreen(index)}
            className="p-2 rounded-button bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
            title="Fullscreen"
            type="button"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

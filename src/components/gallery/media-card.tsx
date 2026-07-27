'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Share2, Heart, Maximize2 } from 'lucide-react';
import { MediaItem } from '@/types';
import { cn } from '@/utils/cn';

export interface MediaCardProps {
  media: MediaItem;
  index: number;
  onOpenFullscreen: (index: number) => void;
  onOpenDownload: (media: MediaItem) => void;
  onOpenShare: (media: MediaItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (mediaId: string) => void;
}

export function MediaCard({
  media,
  index,
  onOpenFullscreen,
  onOpenDownload,
  onOpenShare,
  isFavorite: externalIsFavorite,
  onToggleFavorite,
}: MediaCardProps) {
  const [localIsFavorite, setLocalIsFavorite] = useState(false);
  const [heartPopping, setHeartPopping] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isFavorite = externalIsFavorite !== undefined ? externalIsFavorite : localIsFavorite;

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartPopping(true);
    setTimeout(() => setHeartPopping(false), 500);
    if (onToggleFavorite) {
      onToggleFavorite(media.id);
    } else {
      setLocalIsFavorite(v => !v);
    }
  }, [onToggleFavorite, media.id]);

  // Aspect ratio
  const aspectClass =
    media.aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : media.aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[4/3]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        'group relative rounded-gallery overflow-hidden bg-coal',
        'border border-border dark:border-[#3A2E28]',
        'shadow-md hover:shadow-cherry cursor-pointer',
        'transition-shadow duration-300',
        aspectClass
      )}
    >
      {/* Thumbnail Image — fade in on load */}
      <img
        src={media.thumbnailUrl || media.url}
        alt={media.title}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        className={cn(
          'w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500',
          imgLoaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
      />
      {/* Skeleton while loading */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-warm-ivory to-oil dark:from-[#302720] dark:to-[#261F1C] animate-pulse" />
      )}

      {/* Video Play Overlay */}
      {media.type === 'video' && (
        <div
          onClick={() => onOpenFullscreen(index)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-coal/30 group-hover:bg-coal/50 transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-white/90 text-cherry flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
          {media.durationSeconds && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-coal/80 text-[11px] font-mono text-oil">
              0:{media.durationSeconds < 10 ? `0${media.durationSeconds}` : media.durationSeconds}
            </span>
          )}
        </div>
      )}

      {/* Top Left — Number Badge + Category */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        <span className="px-2.5 py-1 rounded-pill bg-cherry text-[10px] font-bold text-white tracking-wider uppercase shadow-sm">
          #{index + 1}
        </span>
        {media.category && (
          <span className="px-2.5 py-1 rounded-pill bg-oil/85 backdrop-blur-sm text-[10px] text-coal font-medium">
            {media.category}
          </span>
        )}
      </div>

      {/* Favorite Button — Top Right with heart-pop animation */}
      <button
        onClick={handleFavorite}
        className={cn(
          'absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200',
          isFavorite
            ? 'bg-candy text-white shadow-candy/40 shadow-md'
            : 'bg-coal/40 text-white opacity-0 group-hover:opacity-100 hover:bg-coal/60'
        )}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        type="button"
      >
        <Heart
          className={cn(
            'w-3.5 h-3.5 transition-colors',
            isFavorite ? 'fill-current' : '',
            heartPopping && 'heart-popping'
          )}
        />
      </button>

      {/* Bottom overlay — controls */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 bg-gradient-to-t from-coal/90 via-coal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between text-white">
        <div
          className="space-y-0.5 max-w-[65%] cursor-pointer"
          onClick={() => onOpenFullscreen(index)}
        >
          <h4 className="font-editorial text-sm font-semibold truncate leading-snug">{media.title}</h4>
          {media.caption && (
            <p className="text-[11px] text-white/65 truncate">{media.caption}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenShare(media)}
            className="p-2 rounded-button bg-white/15 hover:bg-candy/80 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110"
            title="Share"
            type="button"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenDownload(media)}
            className="relative p-2 rounded-button bg-white/15 hover:bg-cherry/90 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 btn-shine overflow-hidden"
            title="Download"
            type="button"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenFullscreen(index)}
            className="p-2 rounded-button bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110"
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

'use client';

import React from 'react';
import { MediaItem } from '@/types';
import { MediaCard } from './media-card';

export interface MasonryGridProps {
  items: MediaItem[];
  onOpenFullscreen: (index: number) => void;
  onOpenDownload: (media: MediaItem) => void;
  onOpenShare: (media: MediaItem) => void;
}

export function MasonryGrid({
  items,
  onOpenFullscreen,
  onOpenDownload,
  onOpenShare,
}: MasonryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((media, index) => (
        <MediaCard
          key={media.id}
          media={media}
          index={index}
          onOpenFullscreen={onOpenFullscreen}
          onOpenDownload={onOpenDownload}
          onOpenShare={onOpenShare}
        />
      ))}
    </div>
  );
}

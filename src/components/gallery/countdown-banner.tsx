import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { GalleryService } from '@/services/gallery';

export function CountdownBanner({ expiresAt }: { expiresAt?: string }) {
  if (!expiresAt) return null;

  const isExpired = GalleryService.isExpired(expiresAt);
  const daysLeft = GalleryService.getDaysRemaining(expiresAt);

  if (isExpired) {
    return (
      <div className="w-full py-2.5 px-4 bg-red-950/80 border-b border-red-800 text-white text-xs flex items-center justify-center gap-2 font-medium">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <span>This gallery has expired and is no longer publicly available.</span>
      </div>
    );
  }

  if (daysLeft === null || daysLeft <= 0) return null;

  return (
    <div className="w-full py-2 px-4 bg-warm-ivory/60 dark:bg-neutral-900/80 border-b border-warm-ivory dark:border-neutral-800 text-xs text-primary-black dark:text-soft-cream flex items-center justify-center gap-2">
      <Clock className="w-3.5 h-3.5 text-velvet-red" />
      <span>
        Gallery expires in <strong className="font-semibold">{daysLeft} Days</strong>. Be sure to download your favorites.
      </span>
    </div>
  );
}

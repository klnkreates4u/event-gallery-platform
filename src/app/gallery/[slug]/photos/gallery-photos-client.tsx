'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { PolkaDotBg } from '@/components/ui/polka-dot-bg';
import { MediaItem, FilterCategory } from '@/types';
import { MasonryGrid } from '@/components/gallery/masonry-grid';
import { FullscreenViewer } from '@/components/gallery/fullscreen-viewer';
import { DownloadModal } from '@/components/gallery/download-modal';
import { ShareModal } from '@/components/gallery/share-modal';
import { FavoritesDownloadBar } from '@/components/gallery/favorites-download-bar';
import { CountdownBanner } from '@/components/gallery/countdown-banner';
import { RelatedEvents } from '@/components/gallery/related-events';
import { BookingCTA } from '@/components/marketing/booking-cta';
import { Testimonials } from '@/components/marketing/testimonials';
import { EmptyState } from '@/components/ui/empty-state';

const FILTER_CATEGORIES: FilterCategory[] = [
  'All',
  'Photos',
  'Videos',
  '360 Videos',
  'Booth Photos',
  'Booth Strips',
  'GIFs',
];

interface GalleryPhotosClientProps {
  event: any;
}

export default function GalleryPhotosClient({ event }: GalleryPhotosClientProps) {
  const slug = event.slug;

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [downloadTarget, setDownloadTarget] = useState<MediaItem | null>(null);
  const [shareTarget, setShareTarget] = useState<MediaItem | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`gallery_favorites_${slug}`);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      } else {
        setFavorites(new Set());
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
      setFavorites(new Set());
    } finally {
      setIsLoaded(true);
    }
  }, [slug]);

  // Save favorites to local storage whenever it changes — but only
  // after the initial load has completed, so we don't overwrite
  // stored favorites with an empty set on mount.
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`gallery_favorites_${slug}`, JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites, slug, isLoaded]);

  const toggleFavorite = (mediaId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(mediaId)) next.delete(mediaId);
      else next.add(mediaId);
      return next;
    });
  };

  const handleDownloadFavorites = async () => {
    if (favorites.size === 0) return;
    setIsDownloadingZip(true);

    try {
      const favoritedMedia = event.media?.filter((m: any) => favorites.has(m.id)) || [];
      const urls = favoritedMedia.map((m: any) => m.url);

      const res = await fetch('/api/downloads/zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, eventSlug: slug }),
      });

      if (!res.ok) throw new Error('Failed to create ZIP file');

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `${slug}-favorites.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading favorites ZIP:', error);
      alert('Failed to download favorites. Please try again.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Filter media items
  const getFilteredMedia = (): MediaItem[] => {
    let list = [...(event.media || [])];

    if (activeFilter === 'Photos') {
      list = list.filter(
        (m) =>
          m.type.toLowerCase() === 'photo' ||
          m.category === 'Photos' ||
          !m.category
      );
    } else if (activeFilter === 'Videos') {
      list = list.filter(
        (m) => m.type.toLowerCase() === 'video' || m.category === 'Videos'
      );
    } else if (activeFilter === '360 Videos') {
      list = list.filter(
        (m) => m.category === '360 Videos' || m.category?.includes('360')
      );
    } else if (activeFilter === 'Booth Photos') {
      list = list.filter((m) => m.category === 'Booth Photos');
    } else if (activeFilter === 'Booth Strips') {
      list = list.filter((m) => m.category === 'Booth Strips');
    } else if (activeFilter === 'GIFs') {
      list = list.filter(
        (m) => m.category === 'GIFs' || m.url.toLowerCase().endsWith('.gif')
      );
    }

    // Map to MediaItem shape in case fields differ slightly
    return list.map((m) => ({
      id: m.id,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl || m.url,
      title: m.title || '',
      type: m.type.toLowerCase() as 'photo' | 'video',
      aspectRatio: m.aspectRatio || 'landscape',
      category: m.category || 'Photos',
      createdAt: m.createdAt,
    }));
  };

  const filteredMedia = getFilteredMedia();

  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.eventDate,
    location: {
      '@type': 'Place',
      name: event.venue || 'Event Venue',
    },
    description: event.description,
    image: event.coverImageUrl,
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background dark:bg-neutral-950">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PolkaDotBg />
      <CountdownBanner expiresAt={event.expiresAt} />
      <Header />

      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-6 py-8 space-y-10">
        {/* Top Control Toolbar */}
        <div className="flex flex-col gap-4 pb-6 border-b border-border dark:border-neutral-800">
          {/* Row 1: Back button + title */}
          <div className="flex items-center gap-3">
            <Link href={`/gallery/${slug}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0" type="button">
                <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                <span>Welcome Page</span>
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="font-editorial text-xl md:text-2xl font-bold text-primary-black dark:text-soft-cream truncate">
                {event.title}
              </h1>
              <p className="text-xs text-muted-gray mt-0.5">
                Showing {filteredMedia.length} of {event.media?.length || 0} items
              </p>
            </div>
          </div>

          {/* Row 2: Filter chips (full width scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-muted-gray flex-shrink-0" />
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${activeFilter === cat
                    ? 'bg-primary-black text-white font-bold dark:bg-soft-cream dark:text-primary-black shadow-sm'
                    : 'bg-[#F5F2EB] dark:bg-neutral-800 text-[#555555] dark:text-neutral-300 hover:bg-[#ECE7DF] dark:hover:bg-neutral-700'
                  }`}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Media Grid or Empty State */}
        {filteredMedia.length > 0 ? (
          <MasonryGrid
            items={filteredMedia}
            onOpenFullscreen={(index) => setFullscreenIndex(index)}
            onOpenDownload={(media) => setDownloadTarget(media)}
            onOpenShare={(media) => setShareTarget(media)}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <EmptyState
            icon={activeFilter === 'Videos' ? <VideoIcon className="w-10 h-10 text-muted-gray" /> : <ImageIcon className="w-10 h-10 text-muted-gray" />}
            title={`No ${activeFilter} Available`}
            description={`There are currently no items matching the "${activeFilter}" filter in this gallery.`}
            action={
              <Button variant="outline" onClick={() => setActiveFilter('All')} type="button">
                Reset Filter
              </Button>
            }
          />
        )}

        {/* Marketing CTA & Testimonials */}
        <BookingCTA />
        <Testimonials />

        {/* Related Events ("More Memories") */}
        <RelatedEvents currentSlug={slug} />
      </main>

      {/* Favorites Download Toolbar */}
      <FavoritesDownloadBar
        favoritesCount={favorites.size}
        onClearFavorites={() => setFavorites(new Set())}
        onDownloadFavorites={handleDownloadFavorites}
        isDownloading={isDownloadingZip}
      />

      {/* Lightbox / Fullscreen Viewer Modal */}
      <FullscreenViewer
        items={filteredMedia}
        currentIndex={fullscreenIndex}
        onClose={() => setFullscreenIndex(null)}
        onNavigate={(idx) => setFullscreenIndex(idx)}
        onOpenDownload={(media) => setDownloadTarget(media)}
        onOpenShare={(media) => setShareTarget(media)}
      />

      {/* Download Modal */}
      <DownloadModal
        media={downloadTarget}
        isOpen={downloadTarget !== null}
        onClose={() => setDownloadTarget(null)}
      />

      {/* Share Modal */}
      <ShareModal
        media={shareTarget}
        isOpen={shareTarget !== null}
        onClose={() => setShareTarget(null)}
      />

      <Footer />
    </div>
  );
}

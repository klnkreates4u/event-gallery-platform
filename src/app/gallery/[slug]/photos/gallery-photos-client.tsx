'use client';

import React, { useState } from 'react';
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
import { CountdownBanner } from '@/components/gallery/countdown-banner';
import { RelatedEvents } from '@/components/gallery/related-events';
import { BookingCTA } from '@/components/marketing/booking-cta';
import { Testimonials } from '@/components/marketing/testimonials';
import { EmptyState } from '@/components/ui/empty-state';

const FILTER_CATEGORIES: FilterCategory[] = [
  'All',
  'Photos',
  'Videos',
  'Ceremony',
  'Reception',
  'Highlights',
  'Portrait',
  'Landscape',
  'Booth Strips',
  'Family',
  'Newest',
  'Oldest',
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

  // Filter media items
  const getFilteredMedia = (): MediaItem[] => {
    let list = [...(event.media || [])];

    if (activeFilter === 'Photos') {
      list = list.filter((m) => m.type.toLowerCase() === 'photo');
    } else if (activeFilter === 'Videos') {
      list = list.filter((m) => m.type.toLowerCase() === 'video');
    } else if (activeFilter === 'Portrait') {
      list = list.filter((m) => m.aspectRatio === 'portrait');
    } else if (activeFilter === 'Landscape') {
      list = list.filter((m) => m.aspectRatio === 'landscape');
    } else if (activeFilter === 'Newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeFilter === 'Oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (activeFilter !== 'All') {
      list = list.filter((m) => m.category?.toLowerCase() === activeFilter.toLowerCase());
    }

    // Map to MediaItem shape in case fields differ slightly
    return list.map((m) => ({
      id: m.id,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl || m.url,
      title: m.title || '',
      type: m.type.toLowerCase() as 'photo' | 'video',
      aspectRatio: m.aspectRatio || 'landscape',
      category: m.category || 'Highlights',
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
    <div className="relative min-h-screen flex flex-col bg-soft-cream/30 dark:bg-neutral-950">
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-warm-ivory dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <Link href={`/gallery/${slug}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5" type="button">
                <ArrowLeft className="w-4 h-4" />
                <span>Welcome Page</span>
              </Button>
            </Link>
            <div>
              <h1 className="font-editorial text-2xl md:text-3xl font-bold text-primary-black dark:text-soft-cream">
                {event.title}
              </h1>
              <p className="text-xs text-muted-gray mt-0.5">
                Showing {filteredMedia.length} of {event.media?.length || 0} media items
              </p>
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-muted-gray flex-shrink-0 mr-1" />
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === cat
                    ? 'bg-primary-black text-white dark:bg-soft-cream dark:text-primary-black shadow-sm scale-105'
                    : 'bg-warm-ivory/60 dark:bg-neutral-800 text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
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

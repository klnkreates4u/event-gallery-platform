import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GalleryService } from '@/services/gallery';
import GalleryPhotosClient from './gallery-photos-client';
import { EventThemeOverride } from '@/components/gallery/event-theme-override';

interface SmartGalleryPhotosPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmartGalleryPhotosPage({ params }: SmartGalleryPhotosPageProps) {
  const { slug } = await params;
  const event = await GalleryService.getEventBySlug(slug);

  if (!event) {
    return (
      <div className="relative min-h-screen flex flex-col bg-background dark:bg-neutral-950">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <EmptyState
            title="Gallery Not Found"
            description="The requested photo gallery does not exist."
            action={
              <Link href="/search">
                <Button variant="accent">Search Galleries</Button>
              </Link>
            }
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Serialize safely
  const plainEvent = JSON.parse(JSON.stringify(event));

  return (
    <>
      <EventThemeOverride event={plainEvent} />
      <GalleryPhotosClient event={plainEvent} />
    </>
  );
}

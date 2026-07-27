import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GalleryService } from '@/services/gallery';
import GalleryLandingClient from './gallery-landing-client';
import { EventThemeOverride } from '@/components/gallery/event-theme-override';

interface GalleryLandingPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string }>;
}

export default async function GalleryLandingPage({ params, searchParams }: GalleryLandingPageProps) {
  const { slug } = await params;
  const { src } = await searchParams;
  const event = await GalleryService.getEventBySlug(slug);

  // Handle Event Not Found
  if (!event) {
    return (
      <div className="relative min-h-screen flex flex-col bg-background dark:bg-neutral-950">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <EmptyState
            title="Gallery Not Found"
            description="The event gallery you are looking for does not exist or may have been moved."
            action={
              <Link href="/search">
                <Button variant="accent">Search All Galleries</Button>
              </Link>
            }
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Handle Expired Gallery
  const isExpired = GalleryService.isExpired(event.expiresAt);
  if (isExpired) {
    return (
      <div className="relative min-h-screen flex flex-col bg-background dark:bg-neutral-950">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <EmptyState
            icon={<AlertCircle className="w-10 h-10 text-velvet-red" />}
            title="Gallery Expired"
            description="This gallery is no longer publicly available. Please contact the event host or studio for archived access."
            action={
              <Link href="/search">
                <Button variant="outline">Browse Active Galleries</Button>
              </Link>
            }
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Serialize to plain JSON safely
  const plainEvent = JSON.parse(JSON.stringify(event));

  return (
    <>
      <EventThemeOverride event={plainEvent} />
      <GalleryLandingClient event={plainEvent} />
    </>
  );
}

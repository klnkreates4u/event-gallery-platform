'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Images, Video, Lock, ArrowRight, Heart, QrCode } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PolkaDotBg } from '@/components/ui/polka-dot-bg';
import { CoverVideo } from '@/components/gallery/cover-video';
import { CountdownBanner } from '@/components/gallery/countdown-banner';
import { verifyAccessCodeAction } from '@/actions/gallery';

interface GalleryLandingClientProps {
  event: any;
}

export default function GalleryLandingClient({ event }: GalleryLandingClientProps) {
  const router = useRouter();
  const slug = event.slug;

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setIsLoading(true);

    if (event.accessMode === 'ACCESS_CODE') {
      const isValid = await verifyAccessCodeAction(slug, pinInput);
      if (!isValid) {
        setPinError('Invalid access PIN code. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    router.push(`/gallery/${slug}/photos`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-soft-cream/30 dark:bg-neutral-950">
      <PolkaDotBg />
      <CountdownBanner expiresAt={event.expiresAt} />
      <Header />

      <main className="flex-1 relative z-10">
        {/* Large Cover Hero Banner with Cover Video support */}
        <div className="relative h-[65vh] min-h-[460px] w-full overflow-hidden bg-neutral-950 flex items-end">
          <CoverVideo
            videoUrl={event.coverVideoUrl}
            posterUrl={event.coverImageUrl}
            alt={event.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/50 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 w-full text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white">
                  {event.category || 'Event Gallery'}
                </span>
                {event.accessMode === 'QR_ONLY' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Verified Entry</span>
                  </span>
                )}
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                {event.title}
              </h1>

              {/* Event Metadata Badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 pt-2 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-velvet-red" />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                {event.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-velvet-red" />
                    <span>{event.venue}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Images className="w-4 h-4 text-velvet-red" />
                  <span>{event.media?.filter((m: any) => m.type === 'PHOTO').length || 0} Photos</span>
                </div>
                {(event.media?.filter((m: any) => m.type === 'VIDEO').length || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-velvet-red" />
                    <span>{event.media.filter((m: any) => m.type === 'VIDEO').length} Video Clips</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Welcome Section & Access Box */}
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
          {/* Optional Thank You Message */}
          {event.thankYouMessage && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card glass className="p-8 text-center border-warm-ivory dark:border-neutral-800">
                <Heart className="w-6 h-6 text-velvet-red mx-auto mb-3" />
                <p className="font-editorial text-xl sm:text-2xl italic text-primary-black dark:text-soft-cream max-w-2xl mx-auto leading-relaxed">
                  "{event.thankYouMessage}"
                </p>
              </Card>
            </motion.div>
          )}

          {/* Access Card */}
          <Card className="p-8 shadow-xl border border-warm-ivory dark:border-neutral-800">
            <div className="max-w-lg mx-auto space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-primary-black dark:text-soft-cream">
                  {event.accessMode === 'ACCESS_CODE' ? 'Protected Gallery' : 'Welcome to the Gallery'}
                </h3>
                <p className="text-xs text-muted-gray">
                  {event.accessMode === 'ACCESS_CODE'
                    ? 'Please enter the Gallery Access Code provided by your event host to unlock photos.'
                    : 'Explore, favorite, and download your high-resolution memories.'}
                </p>
              </div>

              {/* Form / Button depending on Access Mode */}
              <form onSubmit={handleAccessSubmit} className="space-y-4">
                {event.accessMode === 'ACCESS_CODE' && (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Enter Access PIN"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      icon={<Lock className="w-4 h-4 text-muted-gray" />}
                      className="text-center font-mono text-lg h-14 tracking-widest bg-white dark:bg-neutral-950"
                      error={pinError}
                      required
                    />
                  </div>
                )}

                <Button variant="accent" size="lg" type="submit" disabled={isLoading} className="w-full h-14 text-base font-medium">
                  <span>{isLoading ? 'Opening...' : 'Open Smart Gallery'}</span>
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

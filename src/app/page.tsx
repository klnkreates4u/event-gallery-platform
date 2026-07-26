'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Sparkles, KeyRound, ArrowRight, ShieldCheck, Image as ImageIcon, Video } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PolkaDotBg } from '@/components/ui/polka-dot-bg';
import { siteConfig } from '@/config/site';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-soft-cream/30 dark:bg-neutral-950">
      <PolkaDotBg />
      <Header />

      <main className="flex-1 relative z-10 flex flex-col justify-center">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-warm-ivory dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-xs font-medium text-muted-gray shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-velvet-red" />
              <span>White-Label Luxury Gallery Engine</span>
            </div>

            {/* Main Title */}
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-primary-black dark:text-soft-cream leading-[1.1]">
              Find Your Event Gallery
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-muted-gray max-w-2xl mx-auto font-light leading-relaxed">
              {siteConfig.tagline}
            </p>
          </motion.div>

          {/* Centered Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-xl mx-auto"
          >
            <Card glass className="p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Enter your event code or name..."
                    icon={<Search className="w-5 h-5 text-muted-gray" />}
                    className="h-14 text-base pl-12 bg-white/90 dark:bg-neutral-950/90"
                    readOnly
                  />
                </div>
                <Link href="/search" className="w-full sm:w-auto">
                  <Button variant="accent" size="lg" className="w-full sm:w-auto whitespace-nowrap h-14 px-8">
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Security PIN Hint */}
              <div className="mt-4 pt-3 border-t border-warm-ivory/60 dark:border-neutral-800/60 flex items-center justify-between text-xs text-muted-gray">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-velvet-red" />
                  Private PIN protected galleries supported
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  High-res delivery
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Feature Pillars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto"
          >
            <div className="p-6 rounded-card border border-warm-ivory/80 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-button bg-warm-ivory dark:bg-neutral-800 flex items-center justify-center mb-4 text-primary-black dark:text-soft-cream">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">
                Photobooth & Studio
              </h3>
              <p className="text-xs text-muted-gray mt-1.5 leading-relaxed">
                Instant digital photo delivery designed for high-end events and photobooths.
              </p>
            </div>

            <div className="p-6 rounded-card border border-warm-ivory/80 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-button bg-warm-ivory dark:bg-neutral-800 flex items-center justify-center mb-4 text-primary-black dark:text-soft-cream">
                <Video className="w-5 h-5 text-velvet-red" />
              </div>
              <h3 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">
                Video & Media Clips
              </h3>
              <p className="text-xs text-muted-gray mt-1.5 leading-relaxed">
                Stream 4K recap videos and slow-mo clips with seamless playback.
              </p>
            </div>

            <div className="p-6 rounded-card border border-warm-ivory/80 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-button bg-warm-ivory dark:bg-neutral-800 flex items-center justify-center mb-4 text-primary-black dark:text-soft-cream">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">
                White-Label Ready
              </h3>
              <p className="text-xs text-muted-gray mt-1.5 leading-relaxed">
                Custom domains, studio colors, and zero vendor branding for total control.
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import { Sparkles, ShieldCheck, Image as ImageIcon, Video, Heart } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PolkaDotBg } from '@/components/ui/polka-dot-bg';
import { siteConfig } from '@/config/site';
import { LiveSearch } from '@/components/marketing/live-search';
import { FadeIn } from '@/components/ui/motion';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      <Header />

      <main className="flex-1 relative z-10 flex flex-col">
        {/* ── Hero Section ──────────────────────────────────────────── */}
        <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-5xl mx-auto w-full text-center">
          {/* Candy polka-dot background */}
          <PolkaDotBg variant="candy" className="rounded-3xl opacity-40 dark:opacity-20" />

          {/* Floating decorative dots */}
          <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-candy opacity-50 animate-float" aria-hidden="true" />
          <div className="absolute top-20 right-12 w-2 h-2 rounded-full bg-cherry opacity-40 animate-float" style={{ animationDelay: '1s' }} aria-hidden="true" />
          <div className="absolute bottom-12 left-16 w-2.5 h-2.5 rounded-full bg-candy opacity-35 animate-float" style={{ animationDelay: '2s' }} aria-hidden="true" />

          <FadeIn className="space-y-6 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill border border-candy/40 bg-white/80 dark:bg-[#261F1C]/80 backdrop-blur-sm text-xs font-medium text-cherry shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-candy" />
              <span>Official Event Photo &amp; Video Portal</span>
            </div>

            {/* Hero Heading */}
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-coal dark:text-oil leading-[1.1]">
              Your Event Memories,{' '}
              <span className="text-gradient-cherry">Beautifully Preserved</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-gray max-w-2xl mx-auto font-light leading-relaxed">
              {siteConfig.tagline}
            </p>
          </FadeIn>

          {/* ── Live Search Card ──────────────────────────────────── */}
          <LiveSearch />
        </section>

        {/* ── Feature Pillars ───────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto w-full px-6 pb-20">
          <FadeIn delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: <ImageIcon className="w-5 h-5 text-cherry" />,
                  title: 'High-Res Photos',
                  desc: 'Instant digital photo access and gallery viewing designed for your special event.',
                  accent: 'bg-cherry/10 dark:bg-cherry/15',
                },
                {
                  icon: <Video className="w-5 h-5 text-candy" />,
                  title: 'Video & Media Clips',
                  desc: 'Stream 4K recap videos, boomerangs, and clips with seamless playback.',
                  accent: 'bg-candy/10 dark:bg-candy/15',
                },
                {
                  icon: <ShieldCheck className="w-5 h-5 text-cherry" />,
                  title: 'Easy & Secure Downloads',
                  desc: 'Favorite your top photos and videos to download them all at once — no hassle.',
                  accent: 'bg-candy/20 dark:bg-candy/10',
                },
              ].map((item, i) => (
                <FadeIn
                  key={item.title}
                  delay={0.5 + i * 0.1}
                  className="relative p-6 rounded-card border border-border dark:border-[#3A2E28] bg-white/70 dark:bg-[#261F1C]/70 backdrop-blur-xs hover:shadow-cherry hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle dot corner */}
                  <div className="absolute bottom-0 right-0 w-14 h-14 polka-candy opacity-20 dark:opacity-10 pointer-events-none" aria-hidden="true" />
                  <div className={`w-11 h-11 rounded-button ${item.accent} flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="font-editorial text-lg font-semibold text-coal dark:text-oil">{item.title}</h3>
                  <p className="text-xs text-muted-gray mt-1.5 leading-relaxed">{item.desc}</p>
                </FadeIn>
              ))}
            </div>

            {/* Favorites CTA hint */}
            <FadeIn delay={0.9} className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-gray">
              <Heart className="w-3.5 h-3.5 text-candy fill-current" />
              <span>Tap the heart on any photo to save it — then download your favorites in one ZIP</span>
            </FadeIn>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}

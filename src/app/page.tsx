'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, KeyRound, ArrowRight, ShieldCheck,
  Image as ImageIcon, Video, Calendar, MapPin, Loader2, X, Heart,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PolkaDotBg } from '@/components/ui/polka-dot-bg';
import { siteConfig } from '@/config/site';
import { searchEventsAction } from '@/actions/gallery';

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runSearch = (q: string, d: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim() && !d) { setResults([]); setIsOpen(false); return; }
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const res = await searchEventsAction(q.trim(), d || undefined);
        setResults(res.slice(0, 6));
        setIsOpen(res.length > 0);
      });
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (date) params.set('date', date);
    router.push(`/search?${params.toString()}`);
  };

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 relative z-10"
          >
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
          </motion.div>

          {/* ── Live Search Card ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 max-w-2xl mx-auto relative z-10"
            ref={containerRef}
          >
            <div className="relative">
              <div className="rounded-2xl border border-border dark:border-[#3A2E28] bg-white/90 dark:bg-[#261F1C]/90 backdrop-blur-md shadow-coal/15 shadow-2xl p-5">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Keyword */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gray pointer-events-none" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); runSearch(e.target.value, date); }}
                        onFocus={() => results.length > 0 && setIsOpen(true)}
                        placeholder="Event name or keyword..."
                        className="w-full h-12 pl-10 pr-9 rounded-xl border border-border dark:border-[#3A2E28] bg-white dark:bg-[#1E1A18] text-sm text-coal dark:text-oil placeholder:text-muted-gray focus:outline-none focus:ring-2 focus:ring-cherry/40 focus:border-cherry/50 transition-all"
                      />
                      {(query || date) && (
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => { setQuery(''); setDate(''); setResults([]); setIsOpen(false); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-gray hover:text-coal dark:hover:text-oil"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Date */}
                    <div className="relative sm:w-44">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gray pointer-events-none z-10" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => { setDate(e.target.value); runSearch(query, e.target.value); }}
                        className="w-full h-12 pl-10 pr-3 rounded-xl border border-border dark:border-[#3A2E28] bg-white dark:bg-[#1E1A18] text-sm text-coal dark:text-oil focus:outline-none focus:ring-2 focus:ring-cherry/40 focus:border-cherry/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    suppressHydrationWarning
                    className="relative w-full h-12 rounded-xl bg-[#480c18] hover:bg-[#320815] active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md btn-shine overflow-hidden"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <><span>Search Galleries</span><ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <div className="mt-3 pt-3 border-t border-border/70 dark:border-[#3A2E28]/70 flex items-center justify-between text-xs text-muted-gray">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cherry" />
                    PIN-protected galleries supported
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cherry" />
                    High-res delivery
                  </span>
                </div>
              </div>

              {/* Live search dropdown */}
              <AnimatePresence>
                {isOpen && results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border dark:border-[#3A2E28] bg-white dark:bg-[#261F1C] shadow-2xl overflow-hidden"
                  >
                    {results.map((event) => (
                      <Link
                        key={event.id}
                        href={`/gallery/${event.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-oil/60 dark:hover:bg-[#302720] transition-colors border-b border-border/60 dark:border-[#3A2E28]/60 last:border-0 group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-warm-ivory dark:bg-[#302720]">
                          {event.coverImageUrl
                            ? <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-gray" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-coal dark:text-oil truncate group-hover:text-cherry transition-colors">{event.title}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-gray">
                            {event.eventDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                            {event.venue && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{event.venue}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-gray group-hover:text-cherry flex-shrink-0 transition-colors" />
                      </Link>
                    ))}
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}${date ? `&date=${date}` : ''}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 bg-oil/40 dark:bg-[#302720]/40 text-xs font-semibold text-cherry hover:text-cherry/80 transition-colors"
                    >
                      <span>See all results</span><ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* ── Feature Pillars ───────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto w-full px-6 pb-20"
        >
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
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="relative p-6 rounded-card border border-border dark:border-[#3A2E28] bg-white/70 dark:bg-[#261F1C]/70 backdrop-blur-xs hover:shadow-cherry hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle dot corner */}
                <div className="absolute bottom-0 right-0 w-14 h-14 polka-candy opacity-20 dark:opacity-10 pointer-events-none" aria-hidden="true" />
                <div className={`w-11 h-11 rounded-button ${item.accent} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-editorial text-lg font-semibold text-coal dark:text-oil">{item.title}</h3>
                <p className="text-xs text-muted-gray mt-1.5 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Favorites CTA hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-gray"
          >
            <Heart className="w-3.5 h-3.5 text-candy fill-current" />
            <span>Tap the heart on any photo to save it — then download your favorites in one ZIP</span>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

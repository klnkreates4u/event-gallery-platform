'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, KeyRound, ArrowRight, ShieldCheck,
  Image as ImageIcon, Video, Calendar, MapPin, Loader2, X,
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

  // Close dropdown on outside click
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
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-soft-cream/30 dark:bg-neutral-950">
      <PolkaDotBg />
      <Header />

      <main className="flex-1 relative z-10 flex flex-col justify-center">
        <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-warm-ivory dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-xs font-medium text-muted-gray shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-velvet-red" />
              <span>White-Label Luxury Gallery Engine</span>
            </div>
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-primary-black dark:text-soft-cream leading-[1.1]">
              Find Your Event Gallery
            </h1>
            <p className="text-base sm:text-xl text-muted-gray max-w-2xl mx-auto font-light leading-relaxed">
              {siteConfig.tagline}
            </p>
          </motion.div>

          {/* Live Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-2xl mx-auto"
            ref={containerRef}
          >
            <div className="relative">
              <div className="rounded-2xl border border-warm-ivory dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md shadow-2xl p-5">
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
                        className="w-full h-12 pl-10 pr-9 rounded-xl border border-warm-ivory dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-primary-black dark:text-soft-cream placeholder:text-muted-gray focus:outline-none focus:ring-2 focus:ring-velvet-red/50 transition-shadow"
                      />
                      {(query || date) && (
                        <button type="button" onClick={() => { setQuery(''); setDate(''); setResults([]); setIsOpen(false); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-gray hover:text-primary-black dark:hover:text-soft-cream">
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
                        className="w-full h-12 pl-10 pr-3 rounded-xl border border-warm-ivory dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/50 transition-shadow"
                      />
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full h-12 rounded-xl bg-velvet-red hover:bg-velvet-red/90 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <><span>Search Galleries</span><ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <div className="mt-3 pt-3 border-t border-warm-ivory/60 dark:border-neutral-800/60 flex items-center justify-between text-xs text-muted-gray">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-velvet-red" />
                    PIN-protected galleries supported
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    High-res delivery
                  </span>
                </div>
              </div>

              {/* Live dropdown */}
              <AnimatePresence>
                {isOpen && results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-warm-ivory dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden"
                  >
                    {results.map((event) => (
                      <Link key={event.id} href={`/gallery/${event.slug}`} onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-warm-ivory/50 dark:hover:bg-neutral-800/60 transition-colors border-b border-warm-ivory/60 dark:border-neutral-800/60 last:border-0 group">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-700">
                          {event.coverImageUrl
                            ? <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-gray" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-primary-black dark:text-soft-cream truncate group-hover:text-velvet-red transition-colors">{event.title}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-gray">
                            {event.eventDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                            {event.venue && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{event.venue}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-gray group-hover:text-velvet-red flex-shrink-0 transition-colors" />
                      </Link>
                    ))}
                    <Link href={`/search?q=${encodeURIComponent(query)}${date ? `&date=${date}` : ''}`} onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 bg-warm-ivory/40 dark:bg-neutral-800/40 text-xs font-semibold text-velvet-red hover:text-velvet-red/80 transition-colors">
                      <span>See all results</span><ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Feature Pillars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto"
          >
            {[
              { icon: <ImageIcon className="w-5 h-5" />, title: 'Photobooth & Studio', desc: 'Instant digital photo delivery designed for high-end events and photobooths.' },
              { icon: <Video className="w-5 h-5 text-velvet-red" />, title: 'Video & Media Clips', desc: 'Stream 4K recap videos and slow-mo clips with seamless playback.' },
              { icon: <Sparkles className="w-5 h-5 text-amber-600" />, title: 'White-Label Ready', desc: 'Custom domains, studio colors, and zero vendor branding for total control.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-card border border-warm-ivory/80 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xs">
                <div className="w-10 h-10 rounded-button bg-warm-ivory dark:bg-neutral-800 flex items-center justify-center mb-4">{item.icon}</div>
                <h3 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">{item.title}</h3>
                <p className="text-xs text-muted-gray mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


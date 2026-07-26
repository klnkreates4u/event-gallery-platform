'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Calendar, MapPin, ArrowRight, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PolkaDotBg } from '@/components/ui/polka-dot-bg';
import { searchEventsAction } from '@/actions/gallery';
import { EventDetails } from '@/types';

export default function SearchPage() {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<EventDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitial() {
      const res = await searchEventsAction('');
      setResults(res);
      setIsLoading(false);
    }
    loadInitial();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = eventName.trim();

    if (!cleanName && !eventDate) {
      setError('Please enter an event name or select a date.');
      return;
    }

    setError('');
    setIsLoading(true);
    setHasSearched(true);
    const matches = await searchEventsAction(cleanName, eventDate || undefined);

    if (matches.length === 1) {
      // Direct redirect if exact match found
      router.push(`/gallery/${matches[0].slug}`);
    } else {
      setResults(matches);
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setEventName('');
    setEventDate('');
    setError('');
    setHasSearched(false);
    setIsLoading(true);
    const res = await searchEventsAction('');
    setResults(res);
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-soft-cream/30 dark:bg-neutral-950">
      <PolkaDotBg />
      <Header />

      <main className="flex-1 relative z-10 max-w-6xl mx-auto w-full px-6 py-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-primary-black dark:text-soft-cream">
            Find Your Event
          </h1>
          <p className="text-sm text-muted-gray">
            Search by event title, keyword, or date to access your studio photo gallery.
          </p>

          {/* Search Input Form */}
          <div className="pt-4">
            <Card glass className="p-4 shadow-xl text-left">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    type="text"
                    label="Event Name or Keyword"
                    placeholder="e.g. Grand Gala or Wedding"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    icon={<SearchIcon className="w-4 h-4 text-muted-gray" />}
                    error={error && !eventName && !eventDate ? error : undefined}
                    className="bg-white/90 dark:bg-neutral-950/90 text-sm"
                  />

                  <Input
                    type="date"
                    label="Event Date (Optional)"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    icon={<Calendar className="w-4 h-4 text-muted-gray" />}
                    className="bg-white/90 dark:bg-neutral-950/90 text-sm"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-button bg-red-500/10 border border-red-500/30 text-xs text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  {hasSearched && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Clear Search
                    </Button>
                  )}
                  <Button type="submit" variant="accent" className="h-11 px-8">
                    <span>Search Galleries</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Search Results Grid or Empty State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-velvet-red animate-spin" />
            <p className="text-sm text-muted-gray">Searching galleries...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link href={`/gallery/${event.slug}`}>
                  <Card className="group overflow-hidden p-0 h-full border border-warm-ivory dark:border-neutral-800 hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary-black/70 backdrop-blur-md text-[11px] text-white font-medium">
                        {event.photosCount} Photos
                      </div>
                      {event.accessMode === 'ACCESS_CODE' && (
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-amber-500/80 text-[10px] font-semibold text-black uppercase tracking-wider">
                          PIN Protected
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-editorial text-xl font-semibold text-primary-black dark:text-soft-cream group-hover:text-velvet-red transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-1.5 text-xs text-muted-gray">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-velvet-red" />
                          <span>{event.eventDate}</span>
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-velvet-red" />
                            <span>{event.venue}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-2 flex items-center text-xs font-semibold text-velvet-red group-hover:translate-x-1 transition-transform">
                        <span>Enter Gallery</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No gallery found."
            description="We couldn't find any event matching your search parameters. Please check the spelling or date."
            action={
              <Button variant="accent" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                <span>Search Again</span>
              </Button>
            }
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

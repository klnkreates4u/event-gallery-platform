'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TestimonialItem } from '@/types';

const SAMPLE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote: 'The digital gallery experience was breathtaking. Our guests loved downloading their photobooth strips in full resolution instantly!',
    author: 'Victoria Sterling',
    role: 'Event Host',
    eventTitle: 'The Grand Gala 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
  },
  {
    id: 't2',
    quote: 'Having private PIN access made sharing our intimate wedding photos so seamless and secure. Truly editorial quality!',
    author: 'Elena & Julian',
    role: 'Bride & Groom',
    eventTitle: 'Elena & Julian Wedding',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
  },
  {
    id: 't3',
    quote: 'The video clip streaming and instant QR scanning surpassed all expectations. Will book again for our annual summit.',
    author: 'Marcus Vance',
    role: 'Corporate Producer',
    eventTitle: 'Vogue Summer Soirée',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SAMPLE_TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const active = SAMPLE_TESTIMONIALS[index];

  return (
    <section className="my-12">
      <Card className="p-8 md:p-10 border border-border dark:border-neutral-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 text-candy">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIndex((index - 1 + SAMPLE_TESTIMONIALS.length) % SAMPLE_TESTIMONIALS.length)}
              className="p-2 rounded-full border border-border dark:border-neutral-700 hover:bg-warm-ivory/50 dark:hover:bg-neutral-800 text-primary-black dark:text-soft-cream transition-colors"
              title="Previous Testimonial"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIndex((index + 1) % SAMPLE_TESTIMONIALS.length)}
              className="p-2 rounded-full border border-border dark:border-neutral-700 hover:bg-warm-ivory/50 dark:hover:bg-neutral-800 text-primary-black dark:text-soft-cream transition-colors"
              title="Next Testimonial"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="font-editorial text-xl sm:text-2xl italic text-primary-black dark:text-soft-cream leading-relaxed">
              "{active.quote}"
            </p>

            <div className="flex items-center gap-3 pt-2">
              <img
                src={active.avatarUrl}
                alt={active.author}
                className="w-11 h-11 rounded-full object-cover border border-border"
              />
              <div>
                <h4 className="text-sm font-semibold text-primary-black dark:text-soft-cream">
                  {active.author}
                </h4>
                <p className="text-xs text-muted-gray">
                  {active.role} • {active.eventTitle}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </section>
  );
}

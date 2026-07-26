'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { getRelatedEventsAction } from '@/actions/gallery';
import { Card } from '@/components/ui/card';

export function RelatedEvents({ currentSlug }: { currentSlug: string }) {
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    async function loadRelated() {
      const res = await getRelatedEventsAction(currentSlug);
      setRelated(res);
    }
    loadRelated();
  }, [currentSlug]);

  if (related.length === 0) return null;

  return (
    <section className="py-12 border-t border-warm-ivory dark:border-neutral-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-primary-black dark:text-soft-cream">
            More Memories
          </h3>
          <p className="text-xs text-muted-gray mt-1">Explore other public studio event galleries</p>
        </div>
        <Link href="/search" className="text-xs font-semibold text-velvet-red hover:underline flex items-center gap-1">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((event) => (
          <Link key={event.id} href={`/gallery/${event.slug}`}>
            <Card className="group p-0 overflow-hidden border border-warm-ivory dark:border-neutral-800 hover:shadow-xl transition-all duration-300">
              <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                <img
                  src={event.coverImageUrl || '/placeholder.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary-black/70 backdrop-blur-md text-[10px] text-white font-medium uppercase tracking-wider">
                  {event.category}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream group-hover:text-velvet-red transition-colors truncate">
                  {event.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-gray">
                  <Calendar className="w-3.5 h-3.5 text-velvet-red" />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

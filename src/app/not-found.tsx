'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-soft-cream dark:bg-neutral-950 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-velvet-red/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-warm-ivory/80 dark:bg-neutral-800/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* Error Code */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-editorial text-[10rem] font-bold leading-none text-warm-ivory dark:text-neutral-800 select-none mb-4"
        >
          404
        </motion.div>

        <div className="space-y-4">
          <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">
            Gallery Not Found
          </h1>
          <p className="text-muted-gray text-sm leading-relaxed max-w-sm mx-auto">
            The page or gallery you're looking for doesn't exist. It may have been moved, expired, or the link might be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link href="/">
            <Button variant="accent" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Find a Gallery</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

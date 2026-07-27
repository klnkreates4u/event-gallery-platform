'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (future Sentry integration)
    console.error('[Global Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-oil dark:bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="font-serif text-[8rem] font-bold leading-none text-cherry/20 select-none mb-2">500</div>
        <h1 className="font-serif text-3xl font-bold text-coal dark:text-white mb-3">Something went wrong</h1>
        <p className="text-muted-gray text-sm leading-relaxed max-w-sm mx-auto mb-8">
          An unexpected error occurred. Our team has been notified. Please try refreshing the page.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-3 bg-cherry/10 border border-cherry/30 rounded-card text-left text-xs font-mono text-cherry overflow-auto max-h-32">
            {error.message}
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="accent"
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

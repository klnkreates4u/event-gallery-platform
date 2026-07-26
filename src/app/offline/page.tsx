'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { WifiOff, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-soft-cream dark:bg-neutral-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 rounded-full bg-warm-ivory dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-muted-gray" />
        </div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream mb-3">
          You're Offline
        </h1>
        <p className="text-muted-gray text-sm leading-relaxed max-w-sm mx-auto mb-8">
          It looks like you've lost your internet connection. Check your network settings and try again.
        </p>
        <Button
          variant="accent"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 mx-auto"
        >
          <span>Try Again</span>
        </Button>
      </motion.div>
    </div>
  );
}

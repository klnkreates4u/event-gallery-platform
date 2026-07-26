'use client';

import { motion } from 'framer-motion';
import { WifiOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServiceUnavailablePage() {
  return (
    <div className="min-h-screen bg-soft-cream dark:bg-neutral-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="font-editorial text-[9rem] font-bold leading-none text-warm-ivory dark:text-neutral-800 select-none mb-2">503</div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream mb-3">Service Unavailable</h1>
        <p className="text-muted-gray text-sm leading-relaxed max-w-sm mx-auto mb-8">
          We're currently performing scheduled maintenance to improve your experience. We'll be back shortly.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="accent"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
        <p className="text-xs text-muted-gray mt-6">Expected downtime: under 15 minutes</p>
      </motion.div>
    </div>
  );
}

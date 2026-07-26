'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-soft-cream dark:bg-neutral-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="font-editorial text-[9rem] font-bold leading-none text-warm-ivory dark:text-neutral-800 select-none mb-2">403</div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream mb-3">Access Denied</h1>
        <p className="text-muted-gray text-sm leading-relaxed max-w-sm mx-auto mb-8">
          You don't have permission to access this gallery or resource. Please check your access code or contact the studio.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/search">
            <Button variant="accent" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Find a Gallery</span>
            </Button>
          </Link>
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

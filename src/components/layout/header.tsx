'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Camera, Search, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-neutral-950/80 border-b border-warm-ivory dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-button bg-primary-black dark:bg-soft-cream flex items-center justify-center text-white dark:text-primary-black font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            <span>{siteConfig.logo.symbol}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial font-bold text-lg tracking-wider text-primary-black dark:text-soft-cream flex items-center gap-1">
              {siteConfig.logo.text}{' '}
              <span className="text-velvet-red font-light">{siteConfig.logo.accentText}</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-muted-gray">
              Studio Platform
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-primary-black/80 dark:text-soft-cream/80 hover:text-velvet-red dark:hover:text-velvet-red transition-colors"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-primary-black/80 dark:text-soft-cream/80 hover:text-velvet-red dark:hover:text-velvet-red transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Find Gallery
          </Link>
          <Link
            href="/admin"
            className="text-primary-black/80 dark:text-soft-cream/80 hover:text-velvet-red dark:hover:text-velvet-red transition-colors flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            Studio Portal
          </Link>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { useBranding } from '@/providers/branding-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Camera, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const navLinks = [
  { href: '/',       label: 'Home' },
  { href: '/search', label: 'Find Gallery', icon: Search },
  { href: '/admin',  label: 'Studio Portal', icon: Camera },
];

export function Header() {
  const branding = useBranding();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b border-white/10 text-white bg-[var(--header-bg)] backdrop-blur-md shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Home">
            <img
              src={branding?.logoUrl || '/logo-white.png'}
              alt={branding?.businessName || siteConfig.logo.text}
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" aria-label="Main navigation">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative flex items-center gap-1.5 py-1 transition-colors duration-200',
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/85 hover:text-white'
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {label}
                  {/* Active underline */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="header" />
            <Link href="/admin" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-2 border-white/30 text-white hover:bg-white hover:text-cherry dark:border-white/30 dark:text-white dark:hover:bg-white dark:hover:text-cherry bg-transparent">
                <User className="w-3.5 h-3.5" />
                Sign In
              </Button>
            </Link>
            {/* Mobile menu toggle */}
            <button
              suppressHydrationWarning
              className="md:hidden p-2 rounded-button text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-coal/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-[#F7DCE6] dark:bg-black border-l border-border dark:border-white/15 shadow-2xl md:hidden flex flex-col pt-24 px-6 gap-2"
            >
              {/* Polka decoration */}
              <div className="absolute top-0 left-0 w-full h-24 polka-candy opacity-30 pointer-events-none" aria-hidden="true" />
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-button font-medium text-sm transition-all',
                      isActive
                        ? 'bg-coal text-white shadow-coal/25 shadow-md'
                        : 'text-coal dark:text-oil hover:bg-white/60 dark:hover:bg-neutral-900 hover:text-coal'
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-border dark:border-white/15">
                <Link href="/admin" onClick={() => setMobileOpen(false)}>
                  <Button variant="accent" size="md" className="w-full gap-2">
                    <User className="w-4 h-4" />
                    Sign In to Studio
                  </Button>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { useBranding } from '@/providers/branding-provider';
import { Heart } from 'lucide-react';

export function Footer() {
  const branding = useBranding();

  return (
    <footer className="relative mt-auto overflow-hidden bg-[var(--footer-bg)] text-white">
      {/* Decorative gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cherry/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Mobile Logo (screen sizes like mobile phone and smaller) */}
            <img
              src="/footer-centered-logo.png"
              alt={branding?.businessName || siteConfig.logo.text}
              className="h-12 w-auto object-contain mb-1.5 md:hidden"
            />
            {/* Desktop Logo */}
            <img
              src="/logo-white.png"
              alt={branding?.businessName || siteConfig.logo.text}
              className="h-12 w-auto object-contain mb-1.5 hidden md:block"
            />
            <p className="text-sm text-white font-medium max-w-sm leading-relaxed">
              {branding?.footerText || siteConfig.footer.tagline}
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 md:gap-8 text-sm font-semibold text-white">
            <Link
              href="/privacy"
              className="text-white hover:text-candy transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <Link
              href="/terms"
              className="text-white hover:text-candy transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white text-center md:text-right space-y-1 font-medium">
            <p className="text-sm text-white">{siteConfig.footer.copyright}</p>
            <p className="flex items-center justify-center md:justify-end gap-1 text-xs text-white/90">
              Made with <Heart className="w-3.5 h-3.5 text-candy fill-current" /> by{' '}
              {siteConfig.branding.poweredByText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

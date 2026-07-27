'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { useBranding } from '@/providers/branding-provider';
import { Heart } from 'lucide-react';

export function Footer() {
  const branding = useBranding();

  return (
    <footer className="relative mt-auto overflow-hidden bg-[var(--footer-bg)] text-oil">
      {/* Decorative gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cherry/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="/logo-white.png"
              alt={branding?.businessName || siteConfig.logo.text}
              className="h-12 w-auto object-contain mb-1"
            />
            <p className="text-sm text-oil/75 max-w-sm leading-relaxed">
              {branding?.footerText || siteConfig.footer.tagline}
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link
              href="/privacy"
              className="text-oil/80 hover:text-candy transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-oil/35" />
            <Link
              href="/terms"
              className="text-oil/80 hover:text-candy transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-oil/65 text-center md:text-right space-y-1">
            <p className="text-sm">{siteConfig.footer.copyright}</p>
            <p className="flex items-center justify-center md:justify-end gap-1 text-xs text-oil/50">
              Made with <Heart className="w-3.5 h-3.5 text-candy fill-current" /> by{' '}
              {siteConfig.branding.poweredByText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

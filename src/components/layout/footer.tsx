import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-warm-ivory dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-editorial font-bold text-xl tracking-wider text-primary-black dark:text-soft-cream">
            {siteConfig.logo.text}{' '}
            <span className="text-velvet-red font-light">{siteConfig.logo.accentText}</span>
          </span>
          <p className="text-xs text-muted-gray mt-1 max-w-sm">
            {siteConfig.footer.tagline}
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-gray">
          {siteConfig.footer.links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-primary-black dark:hover:text-soft-cream transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="text-xs text-muted-gray text-center md:text-right">
          <p>{siteConfig.footer.copyright}</p>
          <p className="text-[10px] mt-0.5 text-muted-gray/70">{siteConfig.branding.poweredByText}</p>
        </div>
      </div>
    </footer>
  );
}

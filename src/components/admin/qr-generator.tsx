'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { QrCode, Download, Copy, Check, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generateQRCodeSvgUrl, generateQRCodePngUrl } from '@/utils/event-helpers';

export interface QRGeneratorProps {
  slug: string;
  eventTitle?: string;
}

export function QRGenerator({ slug, eventTitle }: QRGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const galleryUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/gallery/${slug}`;
  const svgUrl = generateQRCodeSvgUrl(slug);
  const pngUrl = generateQRCodePngUrl(slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(galleryUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `qr-${slug}.png`;
    link.target = '_blank';
    link.click();
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-button bg-warm-ivory dark:bg-neutral-800 text-primary-black dark:text-soft-cream">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-primary-black dark:text-soft-cream">Gallery QR Code</h3>
          <p className="text-xs text-muted-gray">Unique QR linking to /gallery/{slug}</p>
        </div>
      </div>

      {/* QR Image */}
      <div className="flex items-center justify-center">
        <div className="p-4 rounded-card bg-[#F7F3EE] border border-warm-ivory shadow-inner w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pngUrl}
            alt={`QR Code for ${eventTitle || slug}`}
            width={180}
            height={180}
            className="block"
          />
        </div>
      </div>

      {/* Gallery URL */}
      <div className="flex items-center gap-2">
        <div className="flex-1 px-3.5 py-2.5 rounded-input bg-soft-cream dark:bg-neutral-800 border border-warm-ivory dark:border-neutral-700 text-xs text-muted-gray overflow-hidden text-ellipsis whitespace-nowrap">
          {galleryUrl}
        </div>
        <button
          onClick={handleCopyLink}
          className="p-2.5 rounded-button border border-warm-ivory dark:border-neutral-700 text-muted-gray hover:text-primary-black dark:hover:text-white hover:bg-warm-ivory/50 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
          title="Copy link"
          type="button"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Download Actions */}
      <div className="flex gap-2.5">
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownloadPng}
          className="flex-1 text-xs flex items-center gap-1.5 justify-center"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </Button>
        <a
          href={svgUrl}
          download={`qr-${slug}.svg`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>SVG</span>
          </Button>
        </a>
      </div>
    </Card>
  );
}

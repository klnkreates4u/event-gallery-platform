'use client';

import React, { useState } from 'react';
import { Download, Link as LinkIcon, QrCode, FileArchive, Check, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { MediaItem } from '@/types';

export interface DownloadModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ media, isOpen, onClose }: DownloadModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!media) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(media.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: 'original' | 'optimized') => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = `${media.title || 'gallery-media'}-${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download Media"
      description="Choose your preferred file resolution or share direct download links."
    >
      <div className="space-y-4 pt-2">
        {/* Media Preview Header */}
        <div className="flex items-center gap-3 p-3 rounded-card bg-soft-cream dark:bg-neutral-800 border border-warm-ivory dark:border-neutral-700">
          <img
            src={media.thumbnailUrl || media.url}
            alt={media.title}
            className="w-14 h-14 object-cover rounded-button"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-primary-black dark:text-soft-cream truncate">
              {media.title}
            </h4>
            <p className="text-xs text-muted-gray">
              {media.type === 'video' ? '4K MP4 Video Clip' : 'High-Res Studio Photo'}
            </p>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-2.5">
          <Button
            variant="primary"
            onClick={() => handleDownload('original')}
            className="w-full justify-between h-12"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Download Original High-Res</span>
            </span>
            <span className="text-xs text-muted-gray uppercase">Max Quality</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleDownload('optimized')}
            className="w-full justify-between h-12"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-velvet-red" />
              <span>Download Web-Optimized</span>
            </span>
            <span className="text-xs text-muted-gray uppercase">Compressed</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="w-full justify-between h-12"
          >
            <span className="flex items-center gap-2">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
            </span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowQR(!showQR)}
            className="w-full justify-between h-12"
          >
            <span className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <span>Show Gallery QR Code</span>
            </span>
          </Button>
        </div>

        {/* QR Display */}
        {showQR && (
          <div className="p-4 rounded-card bg-white dark:bg-neutral-950 border border-warm-ivory dark:border-neutral-800 text-center space-y-2">
            <div className="w-32 h-32 mx-auto bg-primary-black p-3 rounded-button flex items-center justify-center text-white">
              <div className="w-full h-full border-2 border-dashed border-soft-cream flex items-center justify-center text-[10px] font-mono text-center">
                QR CODE LINK
              </div>
            </div>
            <p className="text-[11px] text-muted-gray">Scan with mobile camera to view instantly</p>
          </div>
        )}

        {/* Future ZIP Download Placeholder */}
        <div className="p-3 rounded-card border border-dashed border-warm-ivory dark:border-neutral-800 text-center text-xs text-muted-gray flex items-center justify-center gap-2">
          <FileArchive className="w-4 h-4 text-velvet-red" />
          <span>Full Event ZIP Download available in Module 3</span>
        </div>
      </div>
    </Modal>
  );
}

'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { MediaItem } from '@/types';

export interface ShareModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ media, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!media) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : media.url;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.title,
          text: media.caption || 'Check out this photo from the event!',
          url: currentUrl,
        });
      } catch (err) {
        // Ignored if user cancels native share sheet
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(`Check out "${media.title}" from the event!`);

  const shareLinks = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      color: 'bg-cherry hover:bg-chocolate',
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-chocolate hover:bg-cherry',
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      color: 'bg-cherry/80 hover:bg-cherry',
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      color: 'bg-coal hover:bg-chocolate',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Memory"
      description="Share this photo or video directly with your friends and social networks."
    >
      <div className="space-y-4 pt-2">
        {/* Web Native Share Trigger */}
        {typeof window !== 'undefined' && 'share' in navigator && (
          <Button
            variant="accent"
            onClick={handleNativeShare}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Open System Share Sheet</span>
          </Button>
        )}

        {/* Social Grid */}
        <div className="grid grid-cols-2 gap-3">
          {shareLinks.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-button text-white text-xs font-semibold shadow-xs transition-colors ${platform.color}`}
            >
              <span>{platform.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Input Bar */}
        <div className="pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 h-11 px-3.5 rounded-input bg-soft-cream dark:bg-neutral-800 border border-border dark:border-neutral-700 text-xs text-muted-gray overflow-hidden text-ellipsis"
            />
            <Button
              variant={copied ? 'primary' : 'secondary'}
              onClick={handleCopyLink}
              className="h-11 px-4 text-xs whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-cherry" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5 mr-1" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

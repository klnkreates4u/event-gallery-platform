'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrivacyNoticeModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('event_gallery_privacy_accepted');
    if (!hasAccepted) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('event_gallery_privacy_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 md:left-auto md:right-6 md:bottom-6 md:max-w-sm w-full animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-primary-black dark:bg-neutral-900 text-white rounded-2xl p-5 shadow-2xl border border-white/10 flex flex-col gap-4 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-velvet-red/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="p-2 rounded-full bg-white/10 shrink-0">
            <Shield className="w-5 h-5 text-soft-cream" />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1 text-soft-cream">Privacy & Terms Notice</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              This website temporarily hosts event galleries for guests to view and download media. Galleries are available for a limited time before expiring. By continuing, you acknowledge our policies.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 relative z-10 mt-1">
          <Button 
            onClick={handleAccept} 
            className="w-full bg-velvet-red hover:bg-velvet-red/90 text-white font-medium text-sm"
          >
            Continue
          </Button>
          <div className="flex items-center justify-center gap-3 text-xs text-white/50 pt-2">
            <Link href="/privacy" className="hover:text-white transition-colors underline underline-offset-2">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors underline underline-offset-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

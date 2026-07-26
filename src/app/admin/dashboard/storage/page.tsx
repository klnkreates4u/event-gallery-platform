'use client';

import React from 'react';
import { CheckCircle2, Clock, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STORAGE_PROVIDERS = [
  {
    id: 'LOCAL',
    name: 'Local Storage',
    description: 'Files stored on the server filesystem. Ideal for development and single-server deployments.',
    isActive: true,
    isComingSoon: false,
    icon: '🖥️',
  },
  {
    id: 'CLOUDFLARE_R2',
    name: 'Cloudflare R2',
    description: 'Zero-egress cost object storage with global edge network. Best for production.',
    isActive: false,
    isComingSoon: true,
    icon: '🌐',
  },
  {
    id: 'AMAZON_S3',
    name: 'Amazon S3',
    description: 'Industry-standard cloud object storage with 99.999999999% durability.',
    isActive: false,
    isComingSoon: true,
    icon: '☁️',
  },
  {
    id: 'GOOGLE_DRIVE',
    name: 'Google Drive',
    description: 'Integrate with Google Workspace and share galleries via existing Drive storage.',
    isActive: false,
    isComingSoon: true,
    icon: '📂',
  },
  {
    id: 'CLOUDINARY',
    name: 'Cloudinary',
    description: 'AI-powered media management with automatic image and video optimization.',
    isActive: false,
    isComingSoon: true,
    icon: '✨',
  },
  {
    id: 'DROPBOX',
    name: 'Dropbox',
    description: 'Sync event galleries directly to Dropbox for easy sharing with clients.',
    isActive: false,
    isComingSoon: true,
    icon: '📦',
  },
  {
    id: 'BACKBLAZE',
    name: 'Backblaze B2',
    description: 'Cost-effective cloud storage with 99.999999% data durability guarantee.',
    isActive: false,
    isComingSoon: true,
    icon: '🔒',
  },
];

export default function StoragePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">Storage Providers</h1>
        <p className="text-xs text-muted-gray mt-1">Choose where your event media files are stored and delivered</p>
      </div>

      {/* Current Storage Usage */}
      <Card className="p-5 flex items-center gap-4">
        <div className="p-3 rounded-button bg-soft-cream dark:bg-neutral-800 text-primary-black dark:text-soft-cream">
          <HardDrive className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary-black dark:text-soft-cream">Local Storage Usage</p>
          <div className="mt-2 w-full bg-warm-ivory dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div className="bg-velvet-red h-full w-[45%] rounded-full transition-all duration-700" />
          </div>
          <p className="text-[11px] text-muted-gray mt-1">142.5 GB used of 320 GB total</p>
        </div>
        <span className="text-sm font-bold text-velvet-red font-editorial">45%</span>
      </Card>

      {/* Provider Cards */}
      <div className="space-y-4">
        {STORAGE_PROVIDERS.map((provider) => (
          <Card
            key={provider.id}
            className={`p-5 flex items-center gap-5 transition-all ${
              provider.isActive
                ? 'border-emerald-500/50 dark:border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/10'
                : 'opacity-75'
            }`}
          >
            <div className="text-2xl flex-shrink-0">{provider.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-primary-black dark:text-soft-cream">{provider.name}</h3>
                {provider.isActive && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
                {provider.isComingSoon && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warm-ivory dark:bg-neutral-800 text-muted-gray text-[10px] font-semibold">
                    <Clock className="w-3 h-3" /> Coming Soon
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-gray mt-0.5 max-w-lg">{provider.description}</p>
            </div>
            <div className="flex-shrink-0">
              {provider.isActive ? (
                <Button variant="outline" size="sm" className="text-xs">Configure</Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-xs opacity-50 cursor-not-allowed" disabled>Connect</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, HardDrive, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getStorageUsageAction } from '@/actions/media';

const STORAGE_PROVIDERS = [
  {
    id: 'LOCAL',
    name: 'Local Storage',
    description: 'Files stored on the server filesystem. Ideal for development and single-server deployments.',
    icon: '🖥️',
  },
  {
    id: 'SUPABASE',
    name: 'Supabase Storage',
    description: 'Cloud object storage integrated with Supabase bucket. Recommended for production.',
    icon: '⚡',
  },
  {
    id: 'CLOUDFLARE_R2',
    name: 'Cloudflare R2',
    description: 'Zero-egress cost object storage with global edge network. Best for production.',
    icon: '🌐',
  },
  {
    id: 'AMAZON_S3',
    name: 'Amazon S3',
    description: 'Industry-standard cloud object storage with 99.999999999% durability.',
    icon: '☁️',
  },
  {
    id: 'GOOGLE_DRIVE',
    name: 'Google Drive',
    description: 'Integrate with Google Workspace and share galleries via existing Drive storage.',
    icon: '📂',
  },
  {
    id: 'CLOUDINARY',
    name: 'Cloudinary',
    description: 'AI-powered media management with automatic image and video optimization.',
    icon: '✨',
  },
  {
    id: 'DROPBOX',
    name: 'Dropbox',
    description: 'Sync event galleries directly to Dropbox for easy sharing with clients.',
    icon: '📦',
  },
  {
    id: 'BACKBLAZE',
    name: 'Backblaze B2',
    description: 'Cost-effective cloud storage with 99.999999% data durability guarantee.',
    icon: '🔒',
  },
];

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function StoragePage() {
  const [loading, setLoading] = useState(true);
  const [storageData, setStorageData] = useState<{
    usedBytes: number;
    planLimitBytes: number;
    providerName: string;
  } | null>(null);

  useEffect(() => {
    async function loadStorage() {
      const data = await getStorageUsageAction();
      setStorageData(data);
      setLoading(false);
    }
    loadStorage();
  }, []);

  if (loading || !storageData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-velvet-red animate-spin" />
        <p className="text-sm text-muted-gray">Calculating storage details...</p>
      </div>
    );
  }

  const activeProviderId = storageData.providerName.includes('Supabase') ? 'SUPABASE' : 'LOCAL';
  const percentage = Math.min(100, Math.max(0, Math.round((storageData.usedBytes / storageData.planLimitBytes) * 100)));

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
          <p className="text-sm font-semibold text-primary-black dark:text-soft-cream">{storageData.providerName} Usage</p>
          <div className="mt-2 w-full bg-warm-ivory dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-velvet-red h-full rounded-full transition-all duration-700" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-gray mt-1">
            {formatBytes(storageData.usedBytes)} used of {formatBytes(storageData.planLimitBytes)} total
          </p>
        </div>
        <span className="text-sm font-bold text-velvet-red font-editorial">{percentage}%</span>
      </Card>

      {/* Provider Cards */}
      <div className="space-y-4">
        {STORAGE_PROVIDERS.map((provider) => {
          const isActive = provider.id === activeProviderId;
          const isComingSoon = provider.id !== 'LOCAL' && provider.id !== 'SUPABASE';

          return (
            <Card
              key={provider.id}
              className={`p-5 flex items-center gap-5 transition-all ${
                isActive
                  ? 'border-cherry/50 dark:border-cherry/30 bg-candy/10 dark:bg-cherry/10'
                  : 'opacity-75'
              }`}
            >
              <div className="text-2xl flex-shrink-0">{provider.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-primary-black dark:text-soft-cream">{provider.name}</h3>
                  {isActive && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-candy/20 text-cherry text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                  {isComingSoon && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warm-ivory dark:bg-neutral-800 text-muted-gray text-[10px] font-semibold">
                      <Clock className="w-3 h-3" /> Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-gray mt-0.5 max-w-lg">{provider.description}</p>
              </div>
              <div className="flex-shrink-0">
                {isActive ? (
                  <Button variant="outline" size="sm" className="text-xs">Configure</Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-xs opacity-50 cursor-not-allowed" disabled>Connect</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

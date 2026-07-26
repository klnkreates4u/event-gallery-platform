import React from 'react';
import { db as prisma } from '@/database/db';
import MediaLibraryClient from '@/components/admin/media-library-client';

export default async function MediaLibraryPage() {
  const media = await prisma.media.findMany({
    include: { event: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-editorial text-3xl font-bold text-primary-black dark:text-soft-cream">Media Library</h1>
        <p className="text-xs text-muted-gray mt-1">{media.length} total files across all events</p>
      </div>
      <MediaLibraryClient initialMedia={media} />
    </div>
  );
}

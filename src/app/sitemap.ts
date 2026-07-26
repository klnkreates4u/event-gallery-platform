import { MetadataRoute } from 'next';
import { db } from '@/database/db';
import { EventStatus } from '@/types/enums';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await db.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        isPublic: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { slug: true, eventDate: true, updatedAt: true },
    });

    eventRoutes = events.map((event) => ({
      url: `${baseUrl}/gallery/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Silently handle db errors at build time (e.g., during static generation)
  }

  return [...staticRoutes, ...eventRoutes];
}

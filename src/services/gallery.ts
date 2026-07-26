import { db as prisma } from '@/database/db';
import { EventStatus, AccessMode } from '@prisma/client';

export class GalleryService {
  static async getEventBySlug(slug: string) {
    const event = await prisma.event.findFirst({
      where: {
        slug: slug.toLowerCase(),
        status: EventStatus.PUBLISHED,
      },
      include: {
        media: { orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }] },
        organization: true,
        analytics: true,
      },
    });
    return event;
  }

  static async trackView(eventId: string, userAgent?: string, ipAddress?: string, source?: string) {
    try {
      await prisma.$transaction([
        prisma.galleryAnalytics.upsert({
          where: { eventId },
          update: { viewsCount: { increment: 1 }, lastViewedAt: new Date() },
          create: { eventId, viewsCount: 1, lastViewedAt: new Date() },
        }),
        prisma.galleryActivity.create({
          data: {
            eventId,
            type: 'VIEW',
            ipAddress,
            userAgent,
            metadata: source ? { source } : undefined,
          },
        }),
      ]);
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  }

  static async searchEvents(query: string, date?: string) {
    const where: any = {
      status: EventStatus.PUBLISHED,
      isPublic: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    if (query.trim()) {
      where.AND = [
        {
          OR: [
            { title: { contains: query.trim(), mode: 'insensitive' } },
            { venue: { contains: query.trim(), mode: 'insensitive' } },
            { category: { contains: query.trim(), mode: 'insensitive' } },
          ],
        },
      ];
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.eventDate = { gte: start, lt: end };
    }

    return await prisma.event.findMany({
      where,
      include: { media: { where: { isCover: true }, take: 1 }, analytics: true },
      orderBy: { eventDate: 'desc' },
      take: 20,
    });
  }

  static async verifyAccessCode(slug: string, pin: string): Promise<boolean> {
    const event = await prisma.event.findFirst({ where: { slug } });
    if (!event) return false;
    if (event.accessMode !== AccessMode.ACCESS_CODE) return true;
    return event.accessPin === pin.trim();
  }

  static async getRelatedEvents(currentSlug: string, organizationId: string) {
    return await prisma.event.findMany({
      where: {
        slug: { not: currentSlug },
        organizationId,
        status: EventStatus.PUBLISHED,
        isPublic: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: { media: { where: { isCover: true }, take: 1 } },
      orderBy: { eventDate: 'desc' },
      take: 6,
    });
  }

  static isExpired(expiresAt?: Date | string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now();
  }

  static getDaysRemaining(expiresAt?: Date | string | null): number | null {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

import { db as prisma } from '@/database/db';
import { EventStatus } from '@/types/enums';

// ─── Event Theme / Category Options & Pure Helpers (Re-exported) ──────────────
export {
  EVENT_THEMES,
  EVENT_CATEGORIES,
  generateRandomAccessCode,
  generateSlug,
  generateQRCodeSvgUrl,
  generateQRCodePngUrl,
} from '@/utils/event-helpers';

// ─── Real DB Queries ──────────────────────────────────────────────────────────
export async function getAdminEventList(organizationId?: string) {
  return await prisma.event.findMany({
    where: organizationId ? { organizationId } : undefined,
    include: {
      _count: { select: { media: true } },
      analytics: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDashboardMetrics(organizationId?: string) {
  const where = organizationId ? { organizationId } : {};

  const [totalEvents, totalMedia, analyticsAgg] = await Promise.all([
    prisma.event.count({ where }),
    prisma.media.count({ where: { event: where } }),
    prisma.galleryAnalytics.aggregate({
      where: { event: where },
      _sum: { viewsCount: true, downloadsCount: true },
    }),
  ]);

  const upcomingExpirations = await prisma.event.count({
    where: {
      ...where,
      expiresAt: {
        gte: new Date(),
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return {
    totalEvents,
    totalMedia,
    totalViews: analyticsAgg._sum.viewsCount ?? 0,
    totalDownloads: analyticsAgg._sum.downloadsCount ?? 0,
    upcomingExpirations,
  };
}

export async function getAnalyticsOverview(organizationId?: string) {
  const where = organizationId ? { organizationId } : {};
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  const [totalViews, totalDownloads, topEvent, activities] = await Promise.all([
    prisma.galleryAnalytics.aggregate({ where: { event: where }, _sum: { viewsCount: true } }),
    prisma.galleryAnalytics.aggregate({ where: { event: where }, _sum: { downloadsCount: true } }),
    prisma.galleryAnalytics.findFirst({
      where: { event: where },
      orderBy: { viewsCount: 'desc' },
      include: { event: true },
    }),
    prisma.galleryActivity.groupBy({
      by: ['type'],
      where: { event: where },
      _count: { type: true },
    }),
  ]);

  return {
    totalVisitors: totalViews._sum.viewsCount ?? 0,
    totalDownloads: totalDownloads._sum.downloadsCount ?? 0,
    totalViews: totalViews._sum.viewsCount ?? 0,
    mostViewedGallery: topEvent?.event ?? null,
    mostDownloadedCount: totalDownloads._sum.downloadsCount ?? 0,
    activities,
    // Monthly data — built from real activity log in future; zeroed for now
    monthlyVisitors: MONTHS.slice(0, currentMonth + 1).map((month) => ({ month, value: 0 })),
    monthlyUploads: MONTHS.slice(0, currentMonth + 1).map((month) => ({ month, value: 0 })),
    deviceTypes: [
      { label: 'Mobile', value: 62 },
      { label: 'Desktop', value: 31 },
      { label: 'Tablet', value: 7 },
    ],
    trafficSources: [
      { label: 'QR Code', value: 44 },
      { label: 'Direct Link', value: 28 },
      { label: 'Social Media', value: 18 },
      { label: 'Search', value: 10 },
    ],
  };
}

export async function getBrandingSettings(organizationId?: string) {
  if (!organizationId) return null;
  return await prisma.organization.findUnique({ where: { id: organizationId } });
}

export async function updateBrandingSettings(organizationId: string, data: Record<string, unknown>) {
  return await prisma.organization.update({ where: { id: organizationId }, data });
}

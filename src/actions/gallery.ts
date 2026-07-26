'use server';

import { db } from '@/database/db';
import { GalleryService } from '@/services/gallery';

export async function searchEventsAction(query: string, date?: string) {
  try {
    const results = await GalleryService.searchEvents(query, date);
    // Serialize to plain JSON objects for Client Component transmission
    return JSON.parse(JSON.stringify(results));
  } catch (err) {
    console.error('searchEventsAction Error:', err);
    return [];
  }
}

export async function verifyAccessCodeAction(slug: string, pin: string) {
  try {
    return await GalleryService.verifyAccessCode(slug, pin);
  } catch (err) {
    console.error('verifyAccessCodeAction Error:', err);
    return false;
  }
}

export async function getRelatedEventsAction(currentSlug: string, organizationId?: string) {
  try {
    let orgId = organizationId;
    if (!orgId) {
      const event = await db.event.findFirst({ where: { slug: currentSlug } });
      orgId = event?.organizationId ?? undefined;
    }
    if (!orgId) return [];
    const results = await GalleryService.getRelatedEvents(currentSlug, orgId);
    return JSON.parse(JSON.stringify(results));
  } catch (err) {
    console.error('getRelatedEventsAction Error:', err);
    return [];
  }
}

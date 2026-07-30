'use server';

import { z } from 'zod';
import { db } from '@/database/db';
import { auth } from '@/../auth';
import { revalidatePath } from 'next/cache';
import { EventStatus, AccessMode, MediaType } from '@/types/enums';
import { StorageService } from '@/services/storage';
import bcrypt from "bcryptjs";

import { EventSchema, EventFormData } from '@/schemas/event';
export type { EventFormData };

// ─── Server Actions ────────────────────────────────────────────────────

export async function createEventAction(
  formData: EventFormData
): Promise<{ success: boolean; slug?: string; errors?: Record<string, string[]> }> {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, errors: { global: ['Unauthorized. Please log in.'] } };
  }
  const organizationId = session.user.organizationId;

  const validation = EventSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors as any };
  }

  const data = validation.data;

  // Check slug uniqueness
  const existing = await db.event.findUnique({
    where: { slug: data.slug.toLowerCase() },
  });
  if (existing) {
    return { success: false, errors: { slug: ['This slug is already in use by another event.'] } };
  }

  // Create event & connect media items in a transaction
  const createdEvent = await db.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        title: data.title,
        slug: data.slug.toLowerCase(),
        eventDate: new Date(data.eventDate),
        venue: data.venue,
        category: data.category || 'Wedding',
        theme: data.theme || 'Wedding',
        description: data.description,
        story: data.story,
        thankYouMessage: data.thankYouMessage,
        accessMode: data.accessMode as AccessMode,
        accessPin: data.accessMode === 'ACCESS_CODE' ? data.accessPin : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        tags: data.tags,
        isPublic: data.isPublic,
        status: EventStatus.PUBLISHED, // Auto-publish for simplicity
        coverImageUrl: data.coverImageUrl,
        coverVideoUrl: data.coverVideoUrl,
        themePrimaryColor: data.themePrimaryColor,
        themeSecondaryColor: data.themeSecondaryColor,
        themeAccentColor: data.themeAccentColor,
        themeBackgroundColor: data.themeBackgroundColor,
        themeBorderColor: data.themeBorderColor,
        themeButtonColor: data.themeButtonColor,
        organizationId: organizationId!,
      },
    });

    // Create related media records if provided
    if (data.mediaItems && data.mediaItems.length > 0) {
      await tx.media.createMany({
        data: data.mediaItems.map((item, idx) => ({
          url: item.url,
          title: item.title || `Media ${idx + 1}`,
          category: item.category || (item.type === 'VIDEO' ? 'Videos' : 'Photos'),
          type: item.type as MediaType,
          eventId: event.id,
          fileKey: item.url.split('/').pop() || 'file',
          sizeBytes: item.sizeBytes || 0,
          sortOrder: idx,
        })),
      });

      // Also create empty analytics record
      await tx.galleryAnalytics.create({
        data: { eventId: event.id },
      });
    } else {
      await tx.galleryAnalytics.create({
        data: { eventId: event.id },
      });
    }

    return event;
  });

  revalidatePath('/admin/dashboard/events');
  return { success: true, slug: createdEvent.slug };
}

export async function updateEventAction(
  id: string,
  formData: EventFormData
): Promise<{ success: boolean; errors?: Record<string, string[]> }> {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, errors: { global: ['Unauthorized'] } };
  }

  const validation = EventSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors as any };
  }

  const data = validation.data;

  // Check permission & existence
  const event = await db.event.findUnique({
    where: { id },
  });
  if (!event || event.organizationId !== session.user.organizationId) {
    return { success: false, errors: { global: ['Event not found or access denied'] } };
  }

  // Check slug uniqueness
  if (data.slug.toLowerCase() !== event.slug) {
    const existing = await db.event.findUnique({
      where: { slug: data.slug.toLowerCase() },
    });
    if (existing) {
      return { success: false, errors: { slug: ['This slug is already in use by another event.'] } };
    }
  }

  await db.$transaction(async (tx) => {
    // Update event
    await tx.event.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug.toLowerCase(),
        eventDate: new Date(data.eventDate),
        venue: data.venue,
        category: data.category || 'Wedding',
        theme: data.theme || 'Wedding',
        description: data.description,
        story: data.story,
        thankYouMessage: data.thankYouMessage,
        accessMode: data.accessMode as AccessMode,
        accessPin: data.accessMode === 'ACCESS_CODE' ? data.accessPin : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        tags: data.tags,
        isPublic: data.isPublic,
        coverImageUrl: data.coverImageUrl,
        coverVideoUrl: data.coverVideoUrl,
        themePrimaryColor: data.themePrimaryColor,
        themeSecondaryColor: data.themeSecondaryColor,
        themeAccentColor: data.themeAccentColor,
        themeBackgroundColor: data.themeBackgroundColor,
        themeBorderColor: data.themeBorderColor,
        themeButtonColor: data.themeButtonColor,
      },
    });

    // Add new media items if any
    if (data.mediaItems && data.mediaItems.length > 0) {
      const lastMedia = await tx.media.findFirst({
        where: { eventId: id },
        orderBy: { sortOrder: 'desc' },
      });
      const startIdx = lastMedia ? lastMedia.sortOrder + 1 : 0;

      await tx.media.createMany({
        data: data.mediaItems.map((item, idx) => ({
          url: item.url,
          title: item.title || `Media ${startIdx + idx + 1}`,
          category: item.category || (item.type === 'VIDEO' ? 'Videos' : 'Photos'),
          type: item.type as MediaType,
          eventId: id,
          fileKey: item.url.split('/').pop() || 'file',
          sizeBytes: item.sizeBytes || 0,
          sortOrder: startIdx + idx,
        })),
      });
    }
  });

  revalidatePath('/admin/dashboard/events');
  revalidatePath(`/admin/dashboard/events/${id}/edit`);
  revalidatePath(`/gallery/${data.slug.toLowerCase()}`);
  return { success: true };
}

export async function deleteEventAction(
  id: string
): Promise<{ success: boolean; message?: string }> {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, message: 'Unauthorized' };
  }

  const event = await db.event.findUnique({
    where: { id },
    include: { media: true },
  });

  if (!event || event.organizationId !== session.user.organizationId) {
    return { success: false, message: 'Event not found or access denied' };
  }

  // Delete all local media files from storage
  for (const item of event.media) {
    await StorageService.deleteFile(item.url);
  }
  if (event.coverImageUrl) await StorageService.deleteFile(event.coverImageUrl);
  if (event.coverVideoUrl) await StorageService.deleteFile(event.coverVideoUrl);

  // Delete event and cascade deletion of related DB entries
  await db.event.delete({ where: { id } });

  revalidatePath('/admin/dashboard/events');
  return { success: true, message: 'Event deleted successfully.' };
}

export async function archiveEventAction(
  id: string
): Promise<{ success: boolean; message?: string }> {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, message: 'Unauthorized' };
  }

  const event = await db.event.findUnique({ where: { id } });
  if (!event || event.organizationId !== session.user.organizationId) {
    return { success: false, message: 'Event not found or access denied' };
  }

  await db.event.update({
    where: { id },
    data: { status: EventStatus.ARCHIVED },
  });

  revalidatePath('/admin/dashboard/events');
  return { success: true, message: 'Event archived successfully.' };
}

export async function duplicateEventAction(
  id: string
): Promise<{ success: boolean; slug?: string; message?: string }> {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, message: 'Unauthorized' };
  }

  const event = await db.event.findUnique({
    where: { id },
    include: { media: true },
  });

  if (!event || event.organizationId !== session.user.organizationId) {
    return { success: false, message: 'Event not found or access denied' };
  }

  const newSlug = `${event.slug}-copy-${Date.now().toString().slice(-4)}`;

  await db.$transaction(async (tx) => {
    const duplicated = await tx.event.create({
      data: {
        title: `${event.title} (Copy)`,
        slug: newSlug,
        eventDate: event.eventDate,
        venue: event.venue,
        category: event.category,
        theme: event.theme,
        description: event.description,
        story: event.story,
        thankYouMessage: event.thankYouMessage,
        accessMode: event.accessMode,
        accessPin: event.accessPin,
        expiresAt: event.expiresAt,
        seoTitle: event.seoTitle ? `${event.seoTitle} (Copy)` : null,
        seoDescription: event.seoDescription,
        tags: event.tags,
        isPublic: event.isPublic,
        status: event.status,
        coverImageUrl: event.coverImageUrl,
        coverVideoUrl: event.coverVideoUrl,
        organizationId: event.organizationId,
      },
    });

    if (event.media.length > 0) {
      await tx.media.createMany({
        data: event.media.map((m) => ({
          title: m.title,
          caption: m.caption,
          category: m.category,
          fileKey: m.fileKey,
          url: m.url,
          thumbnailUrl: m.thumbnailUrl,
          width: m.width,
          height: m.height,
          durationSeconds: m.durationSeconds,
          sizeBytes: m.sizeBytes,
          sortOrder: m.sortOrder,
          isCover: m.isCover,
          isHero: m.isHero,
          type: m.type,
          eventId: duplicated.id,
        })),
      });
    }

    await tx.galleryAnalytics.create({
      data: { eventId: duplicated.id },
    });
  });

  revalidatePath('/admin/dashboard/events');
  return { success: true, slug: newSlug, message: 'Event duplicated successfully.' };
}

'use server';

import { db } from '@/database/db';
import { auth } from '@/../auth';
import { StorageService } from '@/services/storage';
import { revalidatePath } from 'next/cache';

export async function deleteMediaAction(id: string): Promise<{ success: boolean; message?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const item = await db.media.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!item || item.event.organizationId !== session.user.organizationId) {
      return { success: false, message: 'File not found or access denied' };
    }

    // Delete the file from local storage
    await StorageService.deleteFile(item.url);
    if (item.thumbnailUrl) await StorageService.deleteFile(item.thumbnailUrl);

    // Delete database record
    await db.media.delete({ where: { id } });

    revalidatePath('/admin/dashboard/media');
    return { success: true, message: 'File deleted successfully.' };
  } catch (err: any) {
    console.error('deleteMediaAction Error:', err);
    return { success: false, message: err.message || 'Something went wrong.' };
  }
}

export async function bulkDeleteMediaAction(ids: string[]): Promise<{ success: boolean; message?: string }> {
  const session = await auth();
  if (!session?.user?.id || !ids.length) {
    return { success: false, message: 'Unauthorized or empty payload' };
  }

  try {
    // Retrieve all files to check permissions and get URLs
    const items = await db.media.findMany({
      where: { id: { in: ids } },
      include: { event: true },
    });

    const unauthorized = items.some((item) => item.event.organizationId !== session.user.organizationId);
    if (unauthorized || items.length !== ids.length) {
      return { success: false, message: 'Some files were not found or access was denied' };
    }

    // Delete all files from local storage
    for (const item of items) {
      await StorageService.deleteFile(item.url);
      if (item.thumbnailUrl) await StorageService.deleteFile(item.thumbnailUrl);
    }

    // Delete records in database in transaction
    await db.media.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath('/admin/dashboard/media');
    return { success: true, message: `${ids.length} files deleted successfully.` };
  } catch (err: any) {
    console.error('bulkDeleteMediaAction Error:', err);
    return { success: false, message: err.message || 'Something went wrong.' };
  }
}

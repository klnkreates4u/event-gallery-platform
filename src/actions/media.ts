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

export async function getStorageUsageAction(): Promise<{ usedBytes: number; planLimitBytes: number; providerName: string }> {
  try {
    const isSupabase = process.env.STORAGE_PROVIDER === 'SUPABASE';
    let totalBytes = 0;

    if (isSupabase) {
      try {
        const result = await db.$queryRaw<any[]>`
          SELECT SUM(COALESCE((metadata->>'size')::numeric, 0)) as total_size 
          FROM storage.objects 
          WHERE bucket_id = 'gallery-media'
        `;
        totalBytes = Number(result?.[0]?.total_size || 0);
      } catch (e) {
        console.warn('Direct storage.objects query failed, falling back to Media records size sum:', e);
        const aggregate = await db.media.aggregate({
          _sum: { sizeBytes: true }
        });
        totalBytes = aggregate._sum.sizeBytes || 0;
      }
    } else {
      const aggregate = await db.media.aggregate({
        _sum: { sizeBytes: true }
      });
      totalBytes = aggregate._sum.sizeBytes || 0;
    }

    const limitGb = process.env.STORAGE_LIMIT_GB ? parseFloat(process.env.STORAGE_LIMIT_GB) : 1;
    const planLimitBytes = limitGb * 1024 * 1024 * 1024;

    return { 
      usedBytes: totalBytes, 
      planLimitBytes, 
      providerName: isSupabase ? 'Supabase Storage' : 'Local Storage' 
    };
  } catch (err) {
    console.error('getStorageUsageAction Error:', err);
    return { 
      usedBytes: 0, 
      planLimitBytes: 1024 * 1024 * 1024, 
      providerName: process.env.STORAGE_PROVIDER === 'SUPABASE' ? 'Supabase Storage' : 'Local Storage' 
    };
  }
}

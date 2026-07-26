import { randomUUID } from 'crypto';
import path from 'path';
import { getStorageProvider } from './storage/index';

type StorageFolder = 'avatars' | 'logos' | 'favicons' | 'events';

// Category mapping: folder → Supabase/provider sub-path
const FOLDER_CATEGORY_MAP: Record<StorageFolder, string> = {
  avatars: 'avatars',
  logos: 'logos',
  favicons: 'favicons',
  events: 'photos',
};

export class StorageService {
  /**
   * Upload a file Buffer through the active storage provider.
   * Returns the public URL of the stored file.
   *
   * The active provider is controlled by STORAGE_PROVIDER env var.
   * Set STORAGE_PROVIDER=SUPABASE to use Supabase Storage.
   */
  static async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    folder: StorageFolder,
    slug: string = 'general'
  ): Promise<string> {
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const category = FOLDER_CATEGORY_MAP[folder] ?? folder;
    const mimeType = getMimeType(ext);

    const provider = getStorageProvider();
    const { url } = await provider.upload(slug, category, filename, buffer, mimeType);
    return url;
  }

  /**
   * Delete a file by its public URL or fileKey.
   * Handles both Supabase public URLs and legacy local /storage/ paths.
   */
  static async deleteFile(publicUrlOrKey: string): Promise<void> {
    if (!publicUrlOrKey) return;

    const provider = getStorageProvider();

    // If it looks like a Supabase public URL, extract the fileKey
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && publicUrlOrKey.startsWith(supabaseUrl)) {
      // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<fileKey>
      const marker = '/object/public/gallery-media/';
      const idx = publicUrlOrKey.indexOf(marker);
      if (idx !== -1) {
        const fileKey = publicUrlOrKey.substring(idx + marker.length);
        await provider.delete(fileKey);
        return;
      }
    }

    // Legacy local path: /storage/<folder>/<filename>
    if (publicUrlOrKey.startsWith('/storage/')) {
      // For local provider only — import inline to avoid breaking non-local builds
      const { default: fs } = await import('fs/promises');
      const p = require('path');
      const filePath = p.join(process.cwd(), 'public', publicUrlOrKey);
      try {
        await fs.unlink(filePath);
      } catch {
        // File may not exist, ignore
      }
      return;
    }

    // Fallback: treat as fileKey directly
    await provider.delete(publicUrlOrKey);
  }
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
  };
  return map[ext.toLowerCase()] ?? 'application/octet-stream';
}

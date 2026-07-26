import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

type StorageFolder = 'avatars' | 'logos' | 'favicons' | 'events';

// Root storage dir is /public/storage so files are publicly accessible at /storage/...
const STORAGE_ROOT = path.join(process.cwd(), 'public', 'storage');

export class StorageService {
  /**
   * Save a file from a Buffer to the local file system.
   * Returns the public URL path (e.g., /storage/avatars/abc123.jpg).
   *
   * Architecture note: swap this function body for an R2/S3 upload call in a
   * future sprint without changing any caller code.
   */
  static async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    folder: StorageFolder
  ): Promise<string> {
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const folderPath = path.join(STORAGE_ROOT, folder);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(path.join(folderPath, filename), buffer);

    return `/storage/${folder}/${filename}`;
  }

  /**
   * Delete a previously stored file given its public URL path.
   * Silently ignores errors (file already deleted, etc.).
   */
  static async deleteFile(publicUrl: string): Promise<void> {
    if (!publicUrl || !publicUrl.startsWith('/storage/')) return;
    const filePath = path.join(process.cwd(), 'public', publicUrl);
    try {
      await fs.unlink(filePath);
    } catch {
      // File may not exist, ignore
    }
  }
}

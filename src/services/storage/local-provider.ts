import fs from 'fs/promises';
import path from 'path';
import { StorageProvider, StorageMetadata } from './types';
import { StorageError } from '@/utils/errors';
import { LoggerService } from '../logger';

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'storage', 'events');
  }

  private getPhysicalPath(fileKey: string): string {
    return path.join(process.cwd(), 'storage', 'events', fileKey);
  }

  async upload(
    slug: string,
    category: string,
    filename: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ url: string; fileKey: string }> {
    try {
      const relativeFolder = path.join(slug, category);
      const targetDir = path.join(this.baseDir, relativeFolder);
      await fs.mkdir(targetDir, { recursive: true });

      const fileKey = path.join(relativeFolder, filename).replace(/\\/g, '/');
      const fullPath = this.getPhysicalPath(fileKey);
      await fs.writeFile(fullPath, fileBuffer);

      LoggerService.info(`File uploaded locally: ${fileKey}`);

      // Expose a public endpoint for downloads
      const publicUrl = `/api/downloads?key=${encodeURIComponent(fileKey)}`;
      return { url: publicUrl, fileKey };
    } catch (err: any) {
      LoggerService.error('Local upload failed', err);
      throw new StorageError(`Local storage upload failed: ${err.message}`);
    }
  }

  async delete(fileKey: string): Promise<boolean> {
    try {
      const fullPath = this.getPhysicalPath(fileKey);
      await fs.unlink(fullPath);
      LoggerService.info(`File deleted: ${fileKey}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  async move(sourceKey: string, destKey: string): Promise<boolean> {
    try {
      const srcPath = this.getPhysicalPath(sourceKey);
      const destPath = this.getPhysicalPath(destKey);
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.rename(srcPath, destPath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async copy(sourceKey: string, destKey: string): Promise<boolean> {
    try {
      const srcPath = this.getPhysicalPath(sourceKey);
      const destPath = this.getPhysicalPath(destKey);
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.copyFile(srcPath, destPath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async exists(fileKey: string): Promise<boolean> {
    try {
      const fullPath = this.getPhysicalPath(fileKey);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getPublicUrl(fileKey: string): Promise<string> {
    return `/api/downloads?key=${encodeURIComponent(fileKey)}`;
  }

  async getThumbnailUrl(fileKey: string): Promise<string> {
    const thumbKey = fileKey.replace(/\/(photos|videos)\//, '/thumbnails/');
    if (await this.exists(thumbKey)) {
      return `/api/downloads?key=${encodeURIComponent(thumbKey)}`;
    }
    return this.getPublicUrl(fileKey);
  }

  async getMetadata(fileKey: string): Promise<StorageMetadata> {
    try {
      const fullPath = this.getPhysicalPath(fileKey);
      const stats = await fs.stat(fullPath);
      return {
        sizeBytes: stats.size,
        format: path.extname(fileKey).replace('.', ''),
        createdAt: stats.birthtime,
      };
    } catch (err: any) {
      throw new StorageError(`Failed to fetch metadata: ${err.message}`);
    }
  }
}

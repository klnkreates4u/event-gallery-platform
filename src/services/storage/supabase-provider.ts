import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { StorageProvider, StorageMetadata } from './types';
import { StorageError } from '@/utils/errors';
import { LoggerService } from '../logger';

export class SupabaseStorageProvider implements StorageProvider {
  private supabase: any;
  private bucket: string;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '';

    this.bucket = process.env.SUPABASE_STORAGE_BUCKET || 'events';

    if (!supabaseUrl || !supabaseKey) {
      LoggerService.warn(
        'Supabase credentials not found. SupabaseStorageProvider will not work correctly.'
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async upload(
    slug: string,
    category: string,
    filename: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ url: string; fileKey: string }> {
    try {
      const fileKey = `${slug}/${category}/${filename}`.replace(/\\/g, '/');

      const { error } = await this.supabase.storage
        .from(this.bucket)
        .upload(fileKey, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) throw error;

      LoggerService.info(`File uploaded to Supabase: ${fileKey}`);

      const publicUrl = await this.getPublicUrl(fileKey);
      return { url: publicUrl, fileKey };
    } catch (err: any) {
      LoggerService.error('Supabase upload failed', err);
      throw new StorageError(`Supabase storage upload failed: ${err.message}`);
    }
  }

  async delete(fileKey: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([fileKey]);

      if (error) throw error;
      LoggerService.info(`File deleted from Supabase: ${fileKey}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  async move(sourceKey: string, destKey: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .move(sourceKey, destKey);

      if (error) throw error;
      return true;
    } catch (err) {
      return false;
    }
  }

  async copy(sourceKey: string, destKey: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .copy(sourceKey, destKey);

      if (error) throw error;
      return true;
    } catch (err) {
      return false;
    }
  }

  async exists(fileKey: string): Promise<boolean> {
    try {
      // Extract the directory path and the exact filename
      // path.posix helps avoid windows backslash issues here
      const dirPath = path.posix.dirname(fileKey);
      const filename = path.posix.basename(fileKey);

      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .list(dirPath === '.' ? '' : dirPath, {
          search: filename,
        });

      if (error) return false;
      return data && data.length > 0;
    } catch {
      return false;
    }
  }

  async getPublicUrl(fileKey: string): Promise<string> {
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileKey);

    return data.publicUrl;
  }

  async getThumbnailUrl(fileKey: string): Promise<string> {
    const thumbKey = fileKey.replace(/\/(photos|videos)\//, '/thumbnails/');
    if (await this.exists(thumbKey)) {
      return await this.getPublicUrl(thumbKey);
    }
    return this.getPublicUrl(fileKey);
  }

  async getMetadata(fileKey: string): Promise<StorageMetadata> {
    try {
      const dirPath = path.posix.dirname(fileKey);
      const filename = path.posix.basename(fileKey);

      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .list(dirPath === '.' ? '' : dirPath, {
          search: filename,
        });

      if (error || !data || data.length === 0) {
        throw new Error('File not found');
      }

      const file = data[0];

      return {
        sizeBytes: file.metadata?.size || 0,
        format: file.name.split('.').pop() || '',
        createdAt: file.created_at ? new Date(file.created_at) : new Date(),
      };
    } catch (err: any) {
      throw new StorageError(
        `Failed to fetch metadata from Supabase: ${err.message}`
      );
    }
  }
}

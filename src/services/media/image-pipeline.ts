import sharp from 'sharp';
import { LoggerService } from '../logger';
import { MediaError } from '@/utils/errors';

export interface ProcessedImageMetadata {
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

export class ImagePipeline {
  static async getMetadata(buffer: Buffer): Promise<ProcessedImageMetadata> {
    try {
      const meta = await sharp(buffer).metadata();
      const width = meta.width || 0;
      const height = meta.height || 0;
      
      let aspectRatio: 'square' | 'portrait' | 'landscape' = 'square';
      if (width > height) aspectRatio = 'landscape';
      else if (height > width) aspectRatio = 'portrait';

      return {
        width,
        height,
        format: meta.format || 'jpeg',
        sizeBytes: buffer.length,
        aspectRatio,
      };
    } catch (err: any) {
      LoggerService.error('Failed to parse image metadata', err);
      throw new MediaError(`Invalid image file: ${err.message}`);
    }
  }

  static async compress(buffer: Buffer, format: 'webp' | 'avif' | 'jpeg' = 'webp', quality = 80): Promise<Buffer> {
    try {
      const pipeline = sharp(buffer).rotate(); // auto-rotate based on EXIF

      if (format === 'webp') {
        return await pipeline.webp({ quality }).toBuffer();
      } else if (format === 'avif') {
        return await pipeline.avif({ quality }).toBuffer();
      } else {
        return await pipeline.jpeg({ quality, progressive: true }).toBuffer();
      }
    } catch (err: any) {
      throw new MediaError(`Image compression failed: ${err.message}`);
    }
  }

  static async resize(buffer: Buffer, width: number): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .toBuffer();
    } catch (err: any) {
      throw new MediaError(`Image resizing failed: ${err.message}`);
    }
  }

  static async generateThumbnail(buffer: Buffer): Promise<Buffer> {
    return this.resize(buffer, 400);
  }
}

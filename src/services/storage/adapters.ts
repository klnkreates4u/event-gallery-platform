import { StorageProvider, StorageMetadata } from './types';

export class CloudflareR2Provider implements StorageProvider {
  async upload() { return { url: '', fileKey: '' }; }
  async delete() { return true; }
  async move() { return true; }
  async copy() { return true; }
  async exists() { return false; }
  async getPublicUrl() { return ''; }
  async getThumbnailUrl() { return ''; }
  async getMetadata(): Promise<StorageMetadata> {
    return { sizeBytes: 0, format: '', createdAt: new Date() };
  }
}

export class AmazonS3Provider implements StorageProvider {
  async upload() { return { url: '', fileKey: '' }; }
  async delete() { return true; }
  async move() { return true; }
  async copy() { return true; }
  async exists() { return false; }
  async getPublicUrl() { return ''; }
  async getThumbnailUrl() { return ''; }
  async getMetadata(): Promise<StorageMetadata> {
    return { sizeBytes: 0, format: '', createdAt: new Date() };
  }
}

export class GoogleDriveProvider implements StorageProvider {
  async upload() { return { url: '', fileKey: '' }; }
  async delete() { return true; }
  async move() { return true; }
  async copy() { return true; }
  async exists() { return false; }
  async getPublicUrl() { return ''; }
  async getThumbnailUrl() { return ''; }
  async getMetadata(): Promise<StorageMetadata> {
    return { sizeBytes: 0, format: '', createdAt: new Date() };
  }
}

export class DropboxProvider implements StorageProvider {
  async upload() { return { url: '', fileKey: '' }; }
  async delete() { return true; }
  async move() { return true; }
  async copy() { return true; }
  async exists() { return false; }
  async getPublicUrl() { return ''; }
  async getThumbnailUrl() { return ''; }
  async getMetadata(): Promise<StorageMetadata> {
    return { sizeBytes: 0, format: '', createdAt: new Date() };
  }
}

export class CloudinaryProvider implements StorageProvider {
  async upload() { return { url: '', fileKey: '' }; }
  async delete() { return true; }
  async move() { return true; }
  async copy() { return true; }
  async exists() { return false; }
  async getPublicUrl() { return ''; }
  async getThumbnailUrl() { return ''; }
  async getMetadata(): Promise<StorageMetadata> {
    return { sizeBytes: 0, format: '', createdAt: new Date() };
  }
}

export class BackblazeProvider implements StorageProvider {
  async upload() { return { url: '', fileKey: '' }; }
  async delete() { return true; }
  async move() { return true; }
  async copy() { return true; }
  async exists() { return false; }
  async getPublicUrl() { return ''; }
  async getThumbnailUrl() { return ''; }
  async getMetadata(): Promise<StorageMetadata> {
    return { sizeBytes: 0, format: '', createdAt: new Date() };
  }
}

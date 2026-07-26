import { StorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';
import {
  CloudflareR2Provider,
  AmazonS3Provider,
  GoogleDriveProvider,
  DropboxProvider,
  CloudinaryProvider,
  BackblazeProvider,
} from './adapters';

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || 'LOCAL';

  switch (provider.toUpperCase()) {
    case 'CLOUDFLARE_R2':
      return new CloudflareR2Provider();
    case 'AMAZON_S3':
      return new AmazonS3Provider();
    case 'GOOGLE_DRIVE':
      return new GoogleDriveProvider();
    case 'DROPBOX':
      return new DropboxProvider();
    case 'CLOUDINARY':
      return new CloudinaryProvider();
    case 'BACKBLAZE':
      return new BackblazeProvider();
    case 'LOCAL':
    default:
      return new LocalStorageProvider();
  }
}

export const storage = getStorageProvider();

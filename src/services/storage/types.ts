export interface StorageMetadata {
  sizeBytes: number;
  format: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  createdAt: Date;
}

export interface StorageProvider {
  upload(
    slug: string,
    category: string,
    filename: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ url: string; fileKey: string }>;
  
  delete(fileKey: string): Promise<boolean>;
  
  move(sourceKey: string, destKey: string): Promise<boolean>;
  
  copy(sourceKey: string, destKey: string): Promise<boolean>;
  
  exists(fileKey: string): Promise<boolean>;
  
  getPublicUrl(fileKey: string): Promise<string>;
  
  getThumbnailUrl(fileKey: string): Promise<string>;
  
  getMetadata(fileKey: string): Promise<StorageMetadata>;
}

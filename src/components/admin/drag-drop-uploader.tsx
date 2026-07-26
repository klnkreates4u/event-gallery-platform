'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, Film, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export type UploadFileType = 'photo' | 'video' | 'any';

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  url?: string;
}

export interface DragDropUploaderProps {
  accept?: UploadFileType;
  multiple?: boolean;
  maxFileSizeMb?: number;
  onUploadComplete?: (urls: string[]) => void;
  onRemoveFile?: (url: string) => void;
  className?: string;
  initialUrls?: string[];
}

export function DragDropUploader({
  accept = 'photo',
  multiple = true,
  maxFileSizeMb = 50,
  onUploadComplete,
  onRemoveFile,
  className,
  initialUrls = [],
}: DragDropUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize from initialUrls (useful for pre-loading values when editing)
  useEffect(() => {
    if (initialUrls.length > 0 && files.length === 0) {
      setFiles(
        initialUrls.map((url, idx) => ({
          id: `initial-${idx}-${Date.now()}`,
          file: new File([], url.split('/').pop() || 'file'),
          preview: url,
          status: 'done',
          progress: 100,
          url,
        }))
      );
    }
  }, [initialUrls]);

  const acceptAttr =
    accept === 'photo'
      ? 'image/jpeg,image/png,image/webp,image/gif'
      : accept === 'video'
      ? 'video/mp4,video/quicktime,video/webm'
      : 'image/*,video/mp4,video/quicktime,video/webm';

  const uploadFile = (uploadedFile: UploadedFile) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', uploadedFile.file);
    formData.append('folder', 'events');

    xhr.open('POST', '/api/upload');

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadedFile.id ? { ...f, progress } : f))
        );
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          const url = response.url;

          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id ? { ...f, status: 'done', progress: 100, url } : f
            )
          );

          // Update parent state with completed uploads
          if (url) {
            onUploadComplete?.([url]);
          }
        } catch {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id ? { ...f, status: 'error', error: 'Upload failed.' } : f
            )
          );
        }
      } else {
        let errorMsg = 'Upload failed.';
        try {
          const err = JSON.parse(xhr.responseText);
          errorMsg = err.error || errorMsg;
        } catch {}
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id ? { ...f, status: 'error', error: errorMsg } : f
          )
        );
      }
    });

    xhr.addEventListener('error', () => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, status: 'error', error: 'Network error.' } : f
        )
      );
    });

    xhr.send(formData);
  };

  const processFiles = useCallback(
    (rawFiles: File[]) => {
      const maxBytes = maxFileSizeMb * 1024 * 1024;
      const toUpload = multiple ? rawFiles : [rawFiles[0]].filter(Boolean);

      const uploaded: UploadedFile[] = toUpload.map((file) => {
        const id = `file-${Date.now()}-${Math.random()}`;
        const isTooBig = file.size > maxBytes;
        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';

        const uploadedFile: UploadedFile = {
          id,
          file,
          preview,
          status: isTooBig ? 'error' : 'uploading',
          progress: 0,
          error: isTooBig ? `File exceeds ${maxFileSizeMb}MB limit` : undefined,
        };

        if (!isTooBig) {
          uploadFile(uploadedFile);
        }

        return uploadedFile;
      });

      setFiles((prev) => (multiple ? [...uploaded, ...prev] : uploaded));
    },
    [maxFileSizeMb, multiple, onUploadComplete]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    processFiles(dropped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    processFiles(selected);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove?.url) {
      onRemoveFile?.(fileToRemove.url);
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-card p-10 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-velvet-red bg-velvet-red/5 dark:bg-velvet-red/10'
            : 'border-warm-ivory dark:border-neutral-800 hover:border-velvet-red/60 hover:bg-warm-ivory/30 dark:hover:bg-neutral-800/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'p-4 rounded-full transition-colors',
              isDragging
                ? 'bg-velvet-red/20 text-velvet-red'
                : 'bg-soft-cream dark:bg-neutral-800 text-muted-gray'
            )}
          >
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <p className="text-sm font-semibold text-primary-black dark:text-soft-cream">
              {isDragging ? 'Drop files here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-muted-gray mt-1">
              {accept === 'photo' && 'JPEG, PNG, WEBP, GIF supported'}
              {accept === 'video' && 'MP4, MOV, WebM supported'}
              {accept === 'any' && 'Photos (JPEG/PNG/WEBP) and Videos (MP4)'}
              {' · '} Max {maxFileSizeMb}MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Upload Queue Preview */}
      {files.length > 0 && (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {files.map((file) => {
            const isVideo = file.file.type.startsWith('video/') || file.url?.endsWith('.mp4');
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-card border border-warm-ivory dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                {/* Preview Thumbnail */}
                <div className="w-12 h-12 rounded-button overflow-hidden bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                  {isVideo ? (
                    <Film className="w-5 h-5 text-muted-gray" />
                  ) : file.preview ? (
                    <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-gray" />
                  )}
                </div>

                {/* File Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-primary-black dark:text-soft-cream truncate">
                      {file.file.name || 'Uploaded File'}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {file.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {file.file.size > 0 && (
                        <span className="text-[11px] text-muted-gray">
                          {(file.file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      )}
                    </div>
                  </div>

                  {file.status === 'error' ? (
                    <p className="text-[11px] text-red-500">{file.error}</p>
                  ) : (
                    <div className="w-full bg-warm-ivory dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-300',
                          file.status === 'done' ? 'bg-emerald-500' : 'bg-velvet-red'
                        )}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  className="p-1.5 rounded-full text-muted-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

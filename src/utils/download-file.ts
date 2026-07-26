/**
 * Triggers a direct file download saved directly to the user's device (laptop, phone, tablet).
 * Uses Blob object URLs and fallback proxy endpoint to ensure browsers force file saving
 * instead of displaying the raw image in a browser tab.
 */
export async function triggerFileDownload(url: string, suggestedFilename?: string): Promise<void> {
  if (!url) return;

  const filename = suggestedFilename || url.split('/').pop()?.split('?')[0] || 'download';

  try {
    // 1. Fetch file data as blob (works for cross-origin URLs with CORS like Supabase Public Storage)
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // 2. Create invisible <a> element with download attribute
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = sanitizeFilename(filename, blob.type);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up memory
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.warn('Direct blob download failed, redirecting through download proxy API:', err);
    // 3. Fallback to server proxy API which sets Content-Disposition: attachment
    const proxyUrl = `/api/downloads?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = proxyUrl;
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 5000);
  }
}

function sanitizeFilename(name: string, mimeType?: string): string {
  let cleaned = name.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Append proper extension if missing
  if (!cleaned.includes('.')) {
    if (mimeType?.includes('png')) cleaned += '.png';
    else if (mimeType?.includes('webp')) cleaned += '.webp';
    else if (mimeType?.includes('mp4')) cleaned += '.mp4';
    else cleaned += '.jpg';
  }
  return cleaned;
}

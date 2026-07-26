import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url');
  const keyParam = searchParams.get('key');
  const customFilename = searchParams.get('filename');

  try {
    let fileBuffer: ArrayBuffer;
    let contentType = 'application/octet-stream';
    let filename = customFilename || 'download';

    if (urlParam) {
      // Fetch remote file (e.g. Supabase Storage URL)
      const res = await fetch(urlParam);
      if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch remote file' }, { status: res.status });
      }
      fileBuffer = await res.arrayBuffer();
      contentType = res.headers.get('content-type') || 'image/jpeg';

      if (!customFilename) {
        const parsedUrl = new URL(urlParam);
        filename = path.basename(parsedUrl.pathname) || 'download';
      }
    } else if (keyParam) {
      // Legacy local file fallback
      const { default: fs } = await import('fs/promises');
      const normalized = path.normalize(keyParam).replace(/^(\.\.[\/\\])+/, '');
      const fullPath = path.join(process.cwd(), 'storage', 'events', normalized);
      await fs.access(fullPath);
      const buffer = await fs.readFile(fullPath);
      fileBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      
      const ext = path.extname(fullPath).toLowerCase();
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.mp4') contentType = 'video/mp4';
      else contentType = 'image/jpeg';

      if (!customFilename) {
        filename = path.basename(fullPath);
      }
    } else {
      return NextResponse.json({ error: 'URL or key parameter is required' }, { status: 400 });
    }

    // Ensure filename has valid extension
    if (!path.extname(filename)) {
      if (contentType.includes('png')) filename += '.png';
      else if (contentType.includes('webp')) filename += '.webp';
      else if (contentType.includes('mp4')) filename += '.mp4';
      else filename += '.jpg';
    }

    // Return with Content-Disposition: attachment header to FORCE browser download dialog on all devices
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    console.error('Download API error:', err);
    return NextResponse.json({ error: err.message || 'File download failed' }, { status: 500 });
  }
}

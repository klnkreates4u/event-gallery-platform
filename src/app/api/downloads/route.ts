import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    // Prevent directory traversal attacks
    const normalized = path.normalize(key).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(process.cwd(), 'storage', 'events', normalized);

    // Verify file exists
    await fs.access(fullPath);
    
    // Read buffer
    const fileBuffer = await fs.readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.avif') mimeType = 'image/avif';
    else if (ext === '.mp4') mimeType = 'video/mp4';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${path.basename(fullPath)}"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

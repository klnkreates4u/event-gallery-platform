import { NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(request: Request) {
  try {
    const { urls, eventSlug } = await request.json();
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    const zip = new JSZip();

    // Fetch all files
    const fetchPromises = urls.map(async (url, index) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Extract filename from URL or generate one
        let filename = url.split('/').pop()?.split('?')[0] || `file-${index + 1}`;
        if (!filename.includes('.')) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('png')) filename += '.png';
          else if (contentType.includes('webp')) filename += '.webp';
          else if (contentType.includes('mp4')) filename += '.mp4';
          else filename += '.jpg'; // fallback
        }
        
        // If there are duplicate names, JSZip might overwrite. Adding index to be safe.
        const nameParts = filename.split('.');
        const ext = nameParts.pop();
        const base = nameParts.join('.');
        filename = `${base}-${index + 1}.${ext}`;

        zip.file(filename, arrayBuffer);
      } catch (err) {
        console.error(`Error zipping file ${url}:`, err);
      }
    });

    await Promise.all(fetchPromises);

    // Generate zip as a nodebuffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new Response(zipBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${eventSlug || 'favorites'}.zip"`,
      },
    });

  } catch (error: any) {
    console.error('ZIP download error:', error);
    return NextResponse.json({ error: error.message || 'ZIP generation failed' }, { status: 500 });
  }
}

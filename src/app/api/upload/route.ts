import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { StorageService } from '@/services/storage';

const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEOS = ['video/mp4', 'video/quicktime', 'video/webm'];

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) ?? 'events';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGES.includes(file.type);
    const isVideo = ALLOWED_VIDEOS.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, and MP4/MOV/WebM videos are allowed.' },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image is too large. Maximum size is 20 MB.' }, { status: 400 });
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ error: 'Video is too large. Maximum size is 100 MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const validFolders = ['avatars', 'logos', 'favicons', 'events'];
    const safeFolder = validFolders.includes(folder)
      ? (folder as 'avatars' | 'logos' | 'favicons' | 'events')
      : 'events';

    const url = await StorageService.uploadBuffer(buffer, file.name, safeFolder);

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('Upload API Error:', err);
    return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
  }

  // Redirect to QR generator server or return dynamic QR svg schema
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/gallery/${slug}`
  )}&size=250x250&color=111111&bgcolor=F7F3EE`;

  return NextResponse.redirect(qrUrl);
}

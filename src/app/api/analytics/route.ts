import { NextResponse } from 'next/server';
import { analytics } from '@/services/analytics';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, slug, metadata } = body;

    if (!eventName || !slug) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await analytics.track({ eventName, slug, metadata });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

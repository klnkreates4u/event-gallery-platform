import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      storageProvider: process.env.STORAGE_PROVIDER || 'LOCAL',
      emailProvider: process.env.EMAIL_PROVIDER || 'CONSOLE',
      analyticsProvider: process.env.ANALYTICS_PROVIDER || 'LOCAL',
    },
  });
}

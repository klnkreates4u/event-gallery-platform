import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/db';
import { StorageService } from '@/services/storage';

/**
 * Gallery Expiration Cleanup Cron Job
 * 
 * This endpoint finds all expired, non-archived events and:
 * 1. Deletes their media files from storage
 * 2. Marks the event as archived in the database
 * 
 * Secure this endpoint by setting CRON_SECRET in your .env file.
 * 
 * Usage: Call this endpoint via a cron service (e.g., Vercel Cron, cron-job.org)
 *   - URL: https://yourdomain.com/api/cron/cleanup
 *   - Method: GET
 *   - Header: Authorization: Bearer YOUR_CRON_SECRET
 *   - Schedule: Daily (e.g., 0 2 * * *)  —  runs at 2am every day
 */
export async function GET(req: NextRequest) {
  // 1. Verify the request is from an authorized cron service
  const authHeader = req.headers.get('Authorization');
  const secret = process.env.CRON_SECRET;
  
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const results = {
    processed: 0,
    eventsArchived: 0,
    filesDeleted: 0,
    errors: [] as string[],
  };

  try {
    // 2. Find all expired, non-archived events that have media
    const expiredEvents = await db.event.findMany({
      where: {
        expiresAt: { lt: now },
        isArchived: false,
      },
      include: {
        media: true,
      },
    });

    results.processed = expiredEvents.length;

    // 3. For each expired event, delete its files and archive it
    for (const event of expiredEvents) {
      try {
        // Delete each media file from storage
        for (const media of event.media) {
          try {
            await StorageService.deleteFile(media.fileKey);
            results.filesDeleted++;
          } catch (fileErr: any) {
            results.errors.push(`Failed to delete file ${media.fileKey}: ${fileErr.message}`);
          }
        }

        // Mark event as archived in the database
        await db.event.update({
          where: { id: event.id },
          data: {
            isArchived: true,
            status: 'ARCHIVED',
          },
        });

        results.eventsArchived++;
      } catch (eventErr: any) {
        results.errors.push(`Failed to process event ${event.slug}: ${eventErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

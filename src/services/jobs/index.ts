import { LoggerService } from '../logger';

export type JobType =
  | 'thumbnail_generation'
  | 'image_compression'
  | 'gallery_expiration'
  | 'media_cleanup'
  | 'analytics_processing';

export interface JobPayload {
  id: string;
  type: JobType;
  data: Record<string, any>;
  createdAt: Date;
}

export class JobQueue {
  private static queue: JobPayload[] = [];
  private static processing = false;

  static async enqueue(type: JobType, data: Record<string, any>): Promise<string> {
    const id = `job-${Date.now()}-${Math.random()}`;
    const payload: JobPayload = { id, type, data, createdAt: new Date() };
    this.queue.push(payload);
    
    LoggerService.info(`[Job Enqueued] ID: ${id} | Type: ${type}`);

    // Process immediately in background
    if (!this.processing) {
      this.processQueue();
    }

    return id;
  }

  private static async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) continue;

      try {
        LoggerService.info(`[Job Processing] ID: ${job.id} | Type: ${job.type}`);
        
        // Simulating job task completion
        await new Promise((resolve) => setTimeout(resolve, 800));

        LoggerService.info(`[Job Completed] ID: ${job.id} | Type: ${job.type}`);
      } catch (err: any) {
        LoggerService.error(`[Job Failed] ID: ${job.id} | Error: ${err.message}`);
      }
    }
    this.processing = false;
  }
}

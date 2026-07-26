import { LoggerService } from '../logger';

export interface AnalyticsEvent {
  eventName: 'gallery_view' | 'download' | 'share' | 'qr_scan' | 'search' | 'video_play';
  slug: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): Promise<boolean>;
}

// ─── Adapters Scaffolding ──────────────────────────────────────────────

export class LocalAnalyticsProvider implements AnalyticsProvider {
  async track(event: AnalyticsEvent): Promise<boolean> {
    LoggerService.info(`[Analytics Tracked] Event: ${event.eventName} | Gallery: ${event.slug}`, event.metadata);
    // In production database analytics update runs here
    return true;
  }
}

export class GoogleAnalyticsProvider implements AnalyticsProvider {
  async track(event: AnalyticsEvent): Promise<boolean> {
    LoggerService.info(`[GA Track Scaffold] Event: ${event.eventName}`);
    return true;
  }
}

export class PostHogProvider implements AnalyticsProvider {
  async track(event: AnalyticsEvent): Promise<boolean> {
    LoggerService.info(`[PostHog Track Scaffold] Event: ${event.eventName}`);
    return true;
  }
}

export class PlausibleProvider implements AnalyticsProvider {
  async track(event: AnalyticsEvent): Promise<boolean> {
    LoggerService.info(`[Plausible Track Scaffold] Event: ${event.eventName}`);
    return true;
  }
}

export class VercelAnalyticsProvider implements AnalyticsProvider {
  async track(event: AnalyticsEvent): Promise<boolean> {
    LoggerService.info(`[Vercel Analytics Track Scaffold] Event: ${event.eventName}`);
    return true;
  }
}

// ─── Resolver ──────────────────────────────────────────────────────────

export function getAnalyticsProvider(): AnalyticsProvider {
  const provider = process.env.ANALYTICS_PROVIDER || 'LOCAL';

  switch (provider.toUpperCase()) {
    case 'GOOGLE_ANALYTICS':
      return new GoogleAnalyticsProvider();
    case 'POSTHOG':
      return new PostHogProvider();
    case 'PLAUSIBLE':
      return new PlausibleProvider();
    case 'VERCEL':
      return new VercelAnalyticsProvider();
    case 'LOCAL':
    default:
      return new LocalAnalyticsProvider();
  }
}

export const analytics = getAnalyticsProvider();

import { LoggerService } from '../logger';

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  send(params: EmailParams): Promise<boolean>;
}

// ─── Adapters Scaffolding ──────────────────────────────────────────────

export class ConsoleEmailProvider implements EmailProvider {
  async send(params: EmailParams): Promise<boolean> {
    LoggerService.info(`[Email Sent Mock] To: ${params.to} | Subject: ${params.subject}`);
    return true;
  }
}

export class ResendEmailProvider implements EmailProvider {
  async send(params: EmailParams): Promise<boolean> {
    LoggerService.info(`[Resend Email Scaffold] Sending to ${params.to}`);
    return true;
  }
}

export class SendGridEmailProvider implements EmailProvider {
  async send(params: EmailParams): Promise<boolean> {
    LoggerService.info(`[SendGrid Email Scaffold] Sending to ${params.to}`);
    return true;
  }
}

export class BrevoEmailProvider implements EmailProvider {
  async send(params: EmailParams): Promise<boolean> {
    LoggerService.info(`[Brevo Email Scaffold] Sending to ${params.to}`);
    return true;
  }
}

export class SmtpEmailProvider implements EmailProvider {
  async send(params: EmailParams): Promise<boolean> {
    LoggerService.info(`[SMTP Email Scaffold] Sending to ${params.to}`);
    return true;
  }
}

// ─── Resolver ──────────────────────────────────────────────────────────

export function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || 'CONSOLE';

  switch (provider.toUpperCase()) {
    case 'RESEND':
      return new ResendEmailProvider();
    case 'SENDGRID':
      return new SendGridEmailProvider();
    case 'BREVO':
      return new BrevoEmailProvider();
    case 'SMTP':
      return new SmtpEmailProvider();
    case 'CONSOLE':
    default:
      return new ConsoleEmailProvider();
  }
}

export const email = getEmailProvider();

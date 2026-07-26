type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class LoggerService {
  private static formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const ctxString = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxString}`;
  }

  static info(message: string, context?: any) {
    console.log(this.formatMessage('info', message, context));
  }

  static warn(message: string, context?: any) {
    console.warn(this.formatMessage('warn', message, context));
  }

  static error(message: string, context?: any) {
    console.error(this.formatMessage('error', message, context));
  }

  static debug(message: string, context?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

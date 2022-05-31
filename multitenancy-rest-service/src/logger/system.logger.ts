import { Injectable, LoggerService } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';

enum WinstonLogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
}

@Injectable()
export default class SystemLogger implements LoggerService {
  public logger: Logger;
  constructor(context: string) {
    const { combine, timestamp, errors, label, printf } = format;
    const customLoggerFormat = printf(
      ({ level, message, Label, Timestamp, stack }) => {
        const log = `${Timestamp} ${level} [${Label}]: ${message}`;
        return stack ? `${log}\n${stack}` : log;
      }
    );
    this.logger = createLogger({
      format: combine(
        errors({ stack: true }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        label({ label: context }),
        customLoggerFormat
      ),
      transports: [new transports.Console(), new transports.File({ filename: 'logs/app.log' })],
    });
  }

  log(message: any) {
    this.logger.log(WinstonLogLevel.INFO, message);
  }
  error(message: any) {
    this.logger.log(WinstonLogLevel.ERROR, message);
  }
  warn(message: any) {
    this.logger.log(WinstonLogLevel.WARN, message);
  }
  debug?(message: any) {
    this.logger.log(WinstonLogLevel.DEBUG, message);
  }
  verbose?(message: any) {
    this.logger.log(WinstonLogLevel.VERBOSE, message);
  }
}

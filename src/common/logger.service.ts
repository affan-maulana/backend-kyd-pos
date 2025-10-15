import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
      filename: './logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [dailyRotateFileTransport, new winston.transports.Console()],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}

export const logger = new LoggerService();

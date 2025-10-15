import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { logger } from '../logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, originalUrl, body } = request;
    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;
    const start = Date.now();

    logger.info(
      `Incoming Request: [${controllerName}] ${method} ${originalUrl} - Handler: ${handlerName} - Payload: ${JSON.stringify(
        body,
      )}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const responseData = {
          message: data?.message,
          statusCode: data?.statusCode,
        };
        const duration = Date.now() - start;
        logger.info(
          `Success: [${controllerName}] ${method} ${originalUrl} - Status ${response.statusCode} - Handler: ${handlerName} - Duration: ${duration}ms - Response: ${JSON.stringify(
            responseData,
          )}`,
        );
      }),
      catchError((err) => {
        const duration = Date.now() - start;
        logger.error(
          `Error: [${controllerName}] ${method} ${originalUrl} - Status ${response.statusCode} - Handler: ${handlerName} - Duration: ${duration}ms - Error: ${err.message}`,
        );
        throw err; // Re-throw the error so it propagates to the client
      }),
    );
  }
}

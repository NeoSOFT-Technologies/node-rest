import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    private readonly logger: Logger
    constructor() {
        this.logger = new Logger('EXCEPTION')
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode: number, message: any;
        if (exception.response && exception.response.statusCode) {
            statusCode = exception.response.statusCode
            message = exception.response.message
        }
        else if (exception.response && exception.response.status) {
            statusCode = exception.response.status
            message = exception.response.data
        }
        else if (exception.status) {
            statusCode = exception.status
            message = exception.message
        }
        else if (exception instanceof HttpException) {
            statusCode = exception.getStatus()
            message = exception.message
        }
        else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            message = 'Internal server error'
        }

        this.logger.error({ statusCode, message });

        response
            .status(statusCode)
            .json({
                statusCode,
                message
            });
    }
}
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import ApiError, { IApiError } from '../api-error.exception';

@Catch(ApiError, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ApiError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as IApiError;
    const code = errorResponse.code ?? exception.name;
    const message = errorResponse.message;
    const stack = exception.cause?.stack ?? exception.stack;

    response.status(status).send({
      statusCode: status,
      code,
      message,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    });
  }
}

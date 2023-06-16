import { ArgumentsHost, Catch, HttpException, HttpServer, HttpStatus } from '@nestjs/common';
import { APP_FILTER, BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

/**
 * {@link PrismaClientExceptionFilter} catches {@link Prisma.PrismaClientKnownRequestError} exceptions.
 */
@Catch(Prisma?.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  /**
   * @param applicationRef
   * @param errorCodesStatusMapping
   */
  constructor(applicationRef?: HttpServer, errorCodesStatusMapping: ErrorCodesStatusMapping | null = null) {
    super(applicationRef as any);

    // use custom error codes mapping (overwrite)
    //
    // @example:
    //
    //   const { httpAdapter } = app.get(HttpAdapterHost);
    //   app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter, {
    //     P2022: HttpStatus.BAD_REQUEST,
    //   }));
    //
    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(this.errorCodesStatusMapping, errorCodesStatusMapping);
    }
  }

  /**
   * @param exception
   * @param host
   * @returns
   */
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    return this.catchClientKnownRequestError(exception, host);
  }

  private catchClientKnownRequestError(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message = `[${exception.code}]: ` + this.exceptionShortMessage(exception.message);

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return super.catch(exception, host);
    }

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));
    return shortMessage.substring(shortMessage.indexOf('\n')).replace(/\n/g, '').trim();
  }
}

export function providePrismaClientExceptionFilter(errorCodesStatusMapping?: ErrorCodesStatusMapping) {
  return {
    provide: APP_FILTER,
    useFactory: ({ httpAdapter }: HttpAdapterHost) => {
      return new PrismaClientExceptionFilter(httpAdapter as any, errorCodesStatusMapping);
    },
    inject: [HttpAdapterHost],
  };
}

// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
// import { Response } from 'express';

// /**
//  *
//  * {@link PrismaClientExceptionFilter} handling {@link Prisma.PrismaClientKnownRequestError} exceptions.
//  *
//  * Error codes definition for Prisma Client (Query Engine)
//  * https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
//  */
// @Catch(Prisma.PrismaClientKnownRequestError)
// export class PrismaClientExceptionFilter implements ExceptionFilter {
//   constructor(private readonly logger: Logger) {}

//   public catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     switch (exception.code) {
//       case 'P2000':
//         this.catchValueTooLong(exception, response);
//         break;
//       case 'P2002':
//         this.catchUniqueConstraint(exception, response);
//         break;
//       case 'P2025':
//         this.catchNotFound(exception, response);
//         break;
//       default:
//         this.unhandledException(exception, response);
//         break;
//     }
//   }

//   /**
//    * Catches P2000 error code
//    * https://www.prisma.io/docs/reference/api-reference/error-reference#p2000
//    *
//    * @param exception P2000
//    * @param response 400 Bad Request
//    */
//   private catchValueTooLong(
//     exception: Prisma.PrismaClientKnownRequestError,
//     response: Response,
//   ) {
//     const status = HttpStatus.BAD_REQUEST;
//     const message = this.cleanUpException(exception);

//     this.logger.warn(message);

//     response.status(status).json({
//       statusCode: status,
//       message,
//     });
//   }

//   /**
//    * Catches P2002 error code
//    * https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
//    *
//    * @param exception P2002
//    * @param response 409 Conflict
//    */
//   private catchUniqueConstraint(
//     exception: Prisma.PrismaClientKnownRequestError,
//     response: Response,
//   ) {
//     const status = HttpStatus.CONFLICT;
//     const message = this.cleanUpException(exception);

//     this.logger.warn(message);

//     response.status(status).json({
//       statusCode: status,
//       message,
//     });
//   }

//   /**
//    * Catches P2025 error code
//    * https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
//    *
//    * @param exception P2025
//    * @param response 404 Not Found
//    */
//   private catchNotFound(
//     exception: Prisma.PrismaClientKnownRequestError,
//     response: Response,
//   ) {
//     const status = HttpStatus.NOT_FOUND;
//     const message = this.cleanUpException(exception);

//     this.logger.warn(message);

//     response.status(status).json({
//       statusCode: status,
//       message,
//     });
//   }

//   private unhandledException(
//     exception: Prisma.PrismaClientKnownRequestError,
//     response: Response,
//   ) {
//     const status = HttpStatus.INTERNAL_SERVER_ERROR;
//     const message = this.cleanUpException(exception);

//     this.logger.warn(message);

//     response.status(status).json({
//       statusCode: status,
//       message,
//     });
//   }

//   /**
//    * Cleans up the exception message
//    * @param exception
//    * @returns string
//    */
//   private cleanUpException(
//     exception: Prisma.PrismaClientKnownRequestError,
//   ): string {
//     const targets = exception.meta?.target as string[];
//     return `${exception.message} ${targets?.join(', ')}!`;
//   }
// }

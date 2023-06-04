import { HttpStatus } from '@nestjs/common';

export interface IApiErrorMessage {
  code: string;
  message: string;
  httpCode: HttpStatus;
}

export const ApiErrorMessage = {
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
    httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  OPERATION_FAILED: {
    code: 'OPERATION_FAILED',
    message: 'Operation failed',
    httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
} as const satisfies Record<string, IApiErrorMessage>;

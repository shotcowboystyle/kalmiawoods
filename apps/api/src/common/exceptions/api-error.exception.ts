import { HttpException } from '@nestjs/common';

import {
  ApiErrorMessage,
  IApiErrorMessage,
} from '../constants/api-error-message.constant';

export interface IApiError {
  code: string;
  message: any;
}

export default class APIError extends HttpException {
  constructor(response: IApiError, status: number, cause?: Error) {
    super(response, status, { cause });
  }

  public static fromCode(
    errorCode: keyof typeof ApiErrorMessage,
    cause?: Error,
  ) {
    const { code, message, httpCode } = ApiErrorMessage[errorCode];

    return new APIError({ code, message }, httpCode, cause);
  }

  public static fromMessage(errorCode: IApiErrorMessage, cause?: Error) {
    const { code, message, httpCode } = errorCode;

    return new APIError({ code, message }, httpCode, cause);
  }
}

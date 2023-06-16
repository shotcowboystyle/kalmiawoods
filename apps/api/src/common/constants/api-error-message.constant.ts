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
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'You are not logged in',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Your token has expired, please login again',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Your token is invalid, please login again',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_REVOKED: {
    code: 'TOKEN_REVOKED',
    message: 'Your token has been revoked, please login again',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  TOKEN_NOT_FOUND_REQ: {
    code: 'TOKEN_NOT_FOUND',
    message: 'Please, provide a token',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_EMAIL_REGISTERED: {
    code: 'USER_EMAIL_REGISTERED',
    message: 'User already register with the same email',
    httpCode: HttpStatus.CONFLICT,
  },
  WRONG_EMAIL: {
    code: 'WRONG_EMAIL',
    message: 'User not found with the given email',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  WRONG_PASSWORD: {
    code: 'WRONG_PASSWORD',
    message: 'Wrong password',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  INCOMPLETE_REGISTRATION: {
    code: 'INCOMPLETE_REGISTRATION',
    message: 'An email has been sent to you with registration instructions',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    httpCode: HttpStatus.NOT_FOUND,
  },
  USER_NOT_VERIFIED: {
    code: 'USER_NOT_VERIFIED',
    message: 'User is not verified, please verify your email',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  EMAIL_EXISTS: {
    code: 'EMAIL_EXISTS',
    message: 'Email already exists',
    httpCode: HttpStatus.CONFLICT,
  },
  USER_PASSWORD_NOT_SET: {
    code: 'USER_PASSWORD_NOT_SET',
    message:
      'User registered with another method, please login with that method. Set password in your profile, if you want to login with password',
    httpCode: HttpStatus.UNAUTHORIZED,
  },
  RESERVATION_NOT_FOUND: {
    code: 'RESERVATION_NOT_FOUND',
    message: 'Reservation not found',
    httpCode: HttpStatus.NOT_FOUND,
  },
} as const satisfies Record<string, IApiErrorMessage>;

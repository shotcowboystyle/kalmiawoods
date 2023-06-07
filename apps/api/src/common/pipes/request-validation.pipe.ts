import {
  HttpStatus,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

import ApiError from '@/common/exceptions/api-error.exception';

export default class RequestValidationPipe extends ValidationPipe {
  constructor(validationOptions?: ValidationPipeOptions) {
    const options = validationOptions ?? {};

    options.exceptionFactory = (errors) => {
      const messages = errors.map((error) => {
        if (error.constraints) {
          const constraints = Object.values(error.constraints);
          return constraints[0];
        }
      });

      return new ApiError(
        { message: messages, code: 'VALIDATION_ERROR' },
        HttpStatus.BAD_REQUEST,
      );
    };
    super(validationOptions);
  }
}

import { User } from '@kalmiawoods/database';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

// import { User } from '@/common/entities/user.entity';
import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import ApiError from '@/common/exceptions/api-error.exception';
import { UserDTO } from '@/modules/user/dtos/user.dto';

import { AuthService } from '../auth.service';
import { RegisterInputDTO } from '../dtos/register.input.dto';

@Resolver(() => UserDTO)
export class RegisterResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @param registerInput
   * @returns UserDTO
   */
  @Mutation(() => UserDTO, {
    description: 'This is the mutation for registering a new user.',
  })
  async register(@Args('data') registerInput: RegisterInputDTO): Promise<User> {
    const result = await this.authService.register(registerInput);

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'USER_NOT_FOUND':
          throw ApiError.fromMessage(ApiErrorMessage.WRONG_EMAIL);
      }

      throw ApiError.fromMessage(
        ApiErrorMessage.INTERNAL_SERVER_ERROR,
        error.cause as Error,
      );
    }

    const response = result.value;
    return response;
  }
}

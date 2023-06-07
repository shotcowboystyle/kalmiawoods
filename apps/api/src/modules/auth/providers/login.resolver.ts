import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { IContext } from '@/common/@types';
import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import ApiError from '@/common/exceptions/api-error.exception';

import { AuthService } from '../auth.service';
import { Public } from '../decorators/public.decorator';
import { AccessTokenDTO } from '../refresh/dtos/access-token.dto';

@Resolver()
export class LoginResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @param email
   * @param password
   * @param ctx
   * @returns AccessTokenDTO
   */
  @Public()
  @Mutation(() => AccessTokenDTO, {
    nullable: true,
    description: 'The login mutation for the login process.',
  })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() ctx: IContext,
  ): Promise<AccessTokenDTO> {
    const result = await this.authService.login(email, password, ctx);

    if (result.isErr()) {
      const error = result.error;

      switch (error.name) {
        case 'USER_NOT_FOUND':
          throw ApiError.fromMessage(ApiErrorMessage.WRONG_EMAIL);
        case 'WRONG_PASSWORD':
          throw ApiError.fromMessage(ApiErrorMessage.WRONG_PASSWORD);
        case 'USER_PASSWORD_NOT_SET':
          throw ApiError.fromMessage(ApiErrorMessage.USER_PASSWORD_NOT_SET);
        case 'INCOMPLETE_REGISTRATION':
          throw ApiError.fromMessage(ApiErrorMessage.INCOMPLETE_REGISTRATION);
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

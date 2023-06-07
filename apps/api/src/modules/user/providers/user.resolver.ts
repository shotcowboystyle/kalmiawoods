import { Args, Context, Query, Resolver } from '@nestjs/graphql';

import { IContext } from '@/common/@types';
// import { Public } from '@/modules/auth/decorators/public.decorator'
import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import { User } from '@/common/entities/user.entity';
import ApiError from '@/common/exceptions/api-error.exception';

import { UserDTO } from '../dtos/user.dto';
// import { UserInputDTO } from '../dtos/user.input.dto'
import { UserService } from '../user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserDTO)
  async findByIdCustom(@Args('id') id: number): Promise<UserDTO | undefined> {
    const user = await this.userService.user({ id });

    if (!user) {
      throw ApiError.fromMessage(ApiErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }

  @Query(() => UserDTO)
  async me(@Context() ctx: IContext): Promise<UserDTO | undefined> {
    const user = await this.userService.user({ uid: ctx.req.user.userId });

    if (!user) {
      throw ApiError.fromMessage(ApiErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }
}

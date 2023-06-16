import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { IContext } from '@/common/@types';
// import { Public } from '@/modules/auth/decorators/public.decorator'
import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import { User } from '@/common/entities/user.entity';
import ApiError from '@/common/exceptions/api-error.exception';
import { ReservationService } from '@/modules/reservation/reservation.service';

import { UserDTO } from '../dtos/user.dto';
// import { UserInputDTO } from '../dtos/user.input.dto'
import { UserService } from '../user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly reservationService: ReservationService,
  ) {}

  @Query(() => UserDTO)
  async findById(@Args('id') id: number): Promise<UserDTO | undefined> {
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

  @ResolveField()
  async reservations(@Parent() user: User) {
    const { id } = user;
    return this.reservationService.findAllForUser(id);
  }
}

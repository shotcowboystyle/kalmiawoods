import { PrismaService, Reservation } from '@kalmiawoods/database';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { IContext } from '@/common/@types';
import { ApiErrorMessage } from '@/common/constants/api-error-message.constant';
import ApiError from '@/common/exceptions/api-error.exception';
import { UserDTO } from '@/modules/user/dtos/user.dto';

import { CreateReservationInputDTO } from '../dtos/create-reservation.input.dto';
// import { GetByRangeDateInputDTO } from '../dtos/get-by-date-range.input.dto';
import { ReservationDTO } from '../dtos/reservation.dto';
import { ReservationService } from '../reservation.service';

@Resolver(() => ReservationDTO)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private prisma: PrismaService,
  ) {}

  @Query(() => ReservationDTO)
  async findById(@Args('id') id: number): Promise<ReservationDTO | undefined> {
    const reservation = await this.reservationService.reservation({ id });

    if (!reservation) {
      throw ApiError.fromMessage(ApiErrorMessage.RESERVATION_NOT_FOUND);
    }

    return reservation;
  }

  @Query(() => [ReservationDTO])
  async getAll(@Context() ctx: IContext): Promise<Reservation[] | undefined> {
    const reservations = await this.reservationService.reservations({});

    if (!reservations) {
      throw ApiError.fromMessage(ApiErrorMessage.RESERVATION_NOT_FOUND);
    }

    return reservations;
  }

  /**
   *
   * @param createReservationInput
   * @returns ReservationDTO
   */
  @Mutation(() => ReservationDTO, {
    description: 'This is the mutation for creating a new reservation.',
  })
  async create(
    @Args('data') createReservationInput: CreateReservationInputDTO,
  ): Promise<ReservationDTO> {
    const result = await this.reservationService.createReservation(
      createReservationInput,
    );

    if (result.isErr()) {
      const error = result.error;

      // switch (error.name) {
      //   case 'USER_NOT_FOUND':
      //     throw ApiError.fromMessage(ApiErrorMessage.INTERNAL_SERVER_ERROR);
      // }

      throw ApiError.fromMessage(
        ApiErrorMessage.INTERNAL_SERVER_ERROR,
        error.cause as Error,
      );
    }

    const response = result.value;
    return response;
  }

  /**
   * Get a specific set of fields for the Reservation's `User`.
   * @param user The resolved parent `Reservation` entity.
   * @param info The GraphQL `info` object, to identify the requested fields.
   * @returns A `User` record, constrained to exposed `UserDTO` fields.
   */
  @ResolveField('user', () => UserDTO)
  async user(
    @Parent() reservation: ReservationDTO,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.prisma.reservation
      .findUnique({ where: { id: reservation.id } })
      .user();
  }
}

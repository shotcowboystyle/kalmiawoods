import { Prisma, PrismaService, Reservation } from '@kalmiawoods/database';
import { Injectable, Logger } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';

import { User } from '@/common/entities/user.entity';
import { CRUDException } from '@/common/exceptions/crud-service.exception';

import { CreateReservationInputDTO } from './dtos/create-reservation.input.dto';
import { ReservationDTO } from './dtos/reservation.dto';

// type ReservationsWithUsers = Prisma.PromiseReturnType<typeof ReservationService.getReservationsWithUsers>

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService, // private encryptionService: EncryptionService,
  ) {}

  private readonly logger: Logger = new Logger(ReservationService.name);

  protected handleError(e: any) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return new CRUDException<Reservation>(
        'EXISTS',
        e,
        (e.meta?.target as any)?.[0] as any,
      );
    }

    this.logger.error(e);

    return new CRUDException<Reservation>('UNKNOWN', e);
  }

  async reservation(
    where: Prisma.ReservationWhereUniqueInput,
  ): Promise<ReservationDTO | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: where,
      include: { user: true },
    });

    this.logger.log(reservation);

    return reservation && new ReservationDTO(reservation);
  }

  async reservations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReservationWhereUniqueInput;
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput;
  }): Promise<Reservation[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.reservation.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { user: true },
    });
  }

  async findAllForUser(userId: User['id']): Promise<Reservation[] | null> {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
    });

    this.logger.log(reservations);

    return reservations;
  }

  async createReservation(
    data: CreateReservationInputDTO,
    // data: Prisma.UserCreateInput,
  ): Promise<Result<ReservationDTO, CRUDException<Reservation>>> {
    // const hashedPassword = await this.encryptionService.hash(
    //   data.password,
    // );

    try {
      const reservation = await this.prisma.reservation.create({
        data: {
          ...data,
          // password: hashedPassword,
          // role: 'USER',
        },
        include: { user: true },
      });

      return ok(new ReservationDTO(reservation));
    } catch (e: any) {
      return err(this.handleError(e));
    }
  }

  async updateReservation(params: {
    where: Prisma.ReservationWhereUniqueInput;
    data: Prisma.ReservationUpdateInput;
  }): Promise<Result<Reservation, CRUDException<Reservation>>> {
    try {
      const { where, data } = params;
      const updatedReservation = await this.prisma.reservation.update({
        data,
        where,
      });
      return ok(updatedReservation);
    } catch (e) {
      return err(this.handleError(e));
    }
  }

  async deleteReservation(
    where: Prisma.ReservationWhereUniqueInput,
  ): Promise<Reservation> {
    return this.prisma.reservation.delete({ where });
  }
}

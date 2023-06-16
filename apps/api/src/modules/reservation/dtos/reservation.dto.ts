import { Reservation } from '@kalmiawoods/database';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

// import { Reservation } from '@/common/entities/reservation.entity';
import { UserDTO } from '@/modules/user/dtos/user.dto';

// import { UserDTO } from '@/modules/user/dtos/user.dto';

@ObjectType('ReservationDTO')
export class ReservationDTO {
  @Expose()
  @Field({ description: "The reservation's UUID" })
  id!: number;

  @Expose()
  @Field({ description: "The Reservation's check in date" })
  checkInDate!: Date;

  @Expose()
  @Field({ description: "The Reservation's check out date" })
  checkOutDate!: Date;

  @Expose()
  @Field()
  userId!: number;

  /** Reservation's associated User entity. */
  @Expose() @Field(() => UserDTO) user!: UserDTO;

  @Expose()
  @Field({ description: "Date of Reservation's creation in the database" })
  public createdAt!: Date;

  @HideField()
  public updatedAt!: Date;

  constructor(partial?: Reservation) {
    Object.assign(this, partial);
  }
}

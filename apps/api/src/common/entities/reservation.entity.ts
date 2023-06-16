import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@ObjectType()
export class Reservation extends BaseEntity {
  @Expose()
  @Field()
  id!: number;

  @Expose()
  @Field(() => String, { nullable: false })
  checkInDate!: Date;

  @Expose()
  @Field(() => String, { nullable: false })
  checkOutDate!: Date;

  @Expose()
  @Field(() => User)
  user!: User;

  @Expose()
  @Field()
  userId!: number;
}

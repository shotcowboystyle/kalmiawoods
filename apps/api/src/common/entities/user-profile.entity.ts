import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@ObjectType()
export class UserProfile extends BaseEntity {
  @Expose()
  @Field()
  id: number;

  @Expose()
  @Field(() => String, { nullable: true })
  address?: string;

  @Expose()
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Expose()
  @Field(() => String, { nullable: true })
  lastName?: string;

  @Expose()
  @Field(() => String, { nullable: true })
  mobilePhone?: string;

  @Expose()
  @Field(() => String, { nullable: true })
  avatar?: string;

  @Expose()
  @Field(() => User)
  user: User;

  get fullName(): string {
    return `${this?.firstName} ${this?.lastName}`;
  }
}

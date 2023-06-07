import { Field, ID, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@ObjectType()
export class UserProfile extends BaseEntity {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  mobilePhone?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  user: User;

  get fullName(): string {
    return `${this?.firstName} ${this?.lastName}`;
  }
}

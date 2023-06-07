import { Field, ID, ObjectType } from '@nestjs/graphql';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@ObjectType()
export class Session extends BaseEntity {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  sessionToken: string;

  @Field(() => String, { nullable: true })
  expiresAt?: string;

  @Field(() => String, { nullable: true })
  userAgent?: string;

  @Field(() => String, { nullable: true })
  ipAddress?: string;

  user: User;
}

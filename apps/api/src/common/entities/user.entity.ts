import {
  Field,
  HideField,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { BaseEntity } from './base.entity';
// import { Session } from './session.entity';
import { UserProfile } from './user-profile.entity';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType('User')
export class User extends BaseEntity {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  uid: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  emailVerification?: Date;

  @Field(() => Role)
  role: Role;

  @Field(() => String, { nullable: true })
  deletedAt?: Date;

  @Field(() => UserProfile)
  profile?: UserProfile;

  // @Field(() => [Session])
  // sessions: Session[];

  @HideField()
  password: string;

  get isAdmin() {
    return this.role === 'ADMIN';
  }

  constructor(partial?: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

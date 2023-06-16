import {
  Field,
  HideField,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

import { BaseEntity } from './base.entity';
import { Reservation } from './reservation.entity';
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
  @Exclude()
  @Field()
  id: number;

  @Field(() => ID)
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

  @Field(() => [Reservation])
  reservations: Reservation[];

  @HideField()
  password: string;

  get isAdmin() {
    return this.role === 'ADMIN';
  }

  // constructor(partial?: Partial<User>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}

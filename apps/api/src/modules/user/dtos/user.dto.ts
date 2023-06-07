import { User } from '@kalmiawoods/database';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType('User')
export class UserDTO {
  @HideField()
  public id!: number;

  @Expose()
  @Field({ description: "The user's UUID" })
  public uid!: string;

  @Expose()
  @Field({ description: "The user's email address" })
  public email!: string;

  @Expose()
  @Field({ description: "The user's first name" })
  public firstName!: string;

  @Expose()
  @Field({ description: "The user's last name" })
  public lastName!: string;

  @Expose()
  @Field({ description: "The state of the user's registration process" })
  public status!: string;

  @HideField()
  public password: string;

  @Expose()
  @Field({ description: "Date of User's creation in the database" })
  public createdAt!: Date;

  @Expose()
  @Field({ description: "Date of last update to User's record" })
  public updatedAt!: Date;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}

import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType('UserInput')
export class UserInputDTO {
  @Field({ description: "The user's first name" })
  @Length(2, 20, { message: 'This is the new message!' })
  public firstName!: string;

  @Field({ description: "The user's last name" })
  public lastName!: string;

  @Field({ description: "The user's email address" })
  public email!: string;

  @Field()
  public status!: string;
}

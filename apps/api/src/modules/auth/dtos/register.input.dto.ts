import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { IsMatch } from '@/common/validators/is-match.decorator';

@InputType()
export class RegisterInputDTO {
  @IsNotEmpty({ message: 'Please provide an email.' })
  // @IsUnique(() => User, 'email')
  // @Transform(lowerCaseTransformer)
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address.',
    },
  )
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  @Field()
  readonly email!: string;

  @MinLength(6)
  @MaxLength(128)
  @IsNotEmpty()
  readonly password!: string;

  @IsMatch('password', {
    message: 'Password confirmation does not match password',
  })
  @MinLength(6)
  @MaxLength(128)
  @IsNotEmpty({ message: 'Password confirmation is required' })
  readonly passwordConfirmation!: string;
}

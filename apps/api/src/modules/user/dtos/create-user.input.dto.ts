import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';
// import { i18nValidationMessage } from 'nestjs-i18n';

// import { IsEnumField } from '@/common/decorators/validation/is-enum-field.decorator';
// import { IsStringField } from '@/common/decorators/validation/is-string-field.decorator';
// import { IsPassword, IsUnique } from '@/common/decorators/validation';
// import { IsUnique } from '@/common/decorators/validation/is-unique.validator';
// import { User, Role } from '@/common/entities/user.entity';
// import { lowerCaseTransformer } from '@/common/transformers/lower-case.transformer';
// import { PasswordConfirmValidator } from '@/common/validators/password-confirm.validator';

@InputType()
export class CreateUserInputDTO {
  @IsNotEmpty({ message: 'Email can not be empty.' })
  // @IsUnique(() => User, 'email')
  // @Transform(lowerCaseTransformer)
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address.',
    },
  )
  @Field()
  readonly email!: string;

  // @IsStringField({ minLength: 8, maxLength: 128 })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  // @IsPassword({ message: i18nValidationMessage('validation.isPassword') })
  // @IsStringField()
  // @IsNotEmpty()
  // @Field()
  // readonly password!: string;

  // @IsNotEmpty({ message: 'password confirmation is not empty' })
  // @Validate(PasswordConfirmValidator, ['password'], {
  //   message: 'password confirmation invalid',
  // })
  // passwordConfirmation: string;

  // @IsEnumField(Role)
  // @Field()
  // readonly role!: Role;

  // @IsStringField()
  @IsNotEmpty()
  @Field()
  readonly firstName!: string;

  // @IsStringField()
  @IsNotEmpty()
  @Field()
  readonly lastName!: string;

  // @IsStringField()
  @Field({ nullable: true })
  readonly address!: string;

  // @IsStringField()
  @IsNotEmpty()
  @IsMobilePhone('fa-IR', { strictMode: false })
  @Field()
  @Field({ nullable: true })
  readonly mobilePhone!: string;
}

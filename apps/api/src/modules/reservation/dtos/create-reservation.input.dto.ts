import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateReservationInputDTO {
  @IsDate({
    message: 'Please provide a valid date.',
  })
  @IsNotEmpty({ message: 'A reservation must include a check in date.' })
  @Field()
  readonly checkInDate!: Date;

  @IsDate({
    message: 'Please provide a valid date.',
  })
  @IsNotEmpty({ message: 'A reservation must include a check out date.' })
  @Field()
  readonly checkOutDate!: Date;

  @IsNumber(
    {},
    {
      message: 'User ID must be a number.',
    },
  )
  @IsNotEmpty({ message: 'A user must be associated with this reservation.' })
  @Field()
  readonly userId!: number;
}

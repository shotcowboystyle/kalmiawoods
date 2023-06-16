import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty } from 'class-validator';

@InputType()
export class GetByRangeDateInputDTO {
  @IsDate({
    message: 'Please provide a valid date.',
  })
  @IsNotEmpty({ message: 'Please provide a start date.' })
  @Field()
  readonly startDate!: Date;

  @IsDate({
    message: 'Please provide a valid date.',
  })
  @IsNotEmpty({ message: 'Please provide an end date.' })
  @Field()
  readonly endDate!: Date;
}

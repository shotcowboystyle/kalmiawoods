import { Field, ObjectType } from '@nestjs/graphql';

export interface IBaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

@ObjectType({ isAbstract: true })
export abstract class BaseEntity implements IBaseEntity {
  @Field(() => BigInt)
  public id: number;

  @Field(() => String)
  public createdAt: Date = new Date();

  @Field(() => String)
  public updatedAt: Date = new Date();
}

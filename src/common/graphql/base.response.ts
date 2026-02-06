import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseResponse {
  @Field(() => Int)
  statusCode!: number;

  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String, { nullable: true })
  message?: string | null;

  @Field(() => String)
  timestamp!: string;
}

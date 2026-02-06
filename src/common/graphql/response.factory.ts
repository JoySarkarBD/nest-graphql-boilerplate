import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from './base.response';

export function createResponseType<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class GenericResponse extends BaseResponse {
    @Field(() => classRef, { nullable: true })
    data!: T | null;
  }

  return GenericResponse;
}

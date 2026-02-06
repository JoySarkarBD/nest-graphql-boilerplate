import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { BaseResponse } from '../base.response';

@ObjectType()
export class UserResponse extends BaseResponse {
  @Field(() => User)
  data!: User;
}

@ObjectType()
export class UsersResponse extends BaseResponse {
  @Field(() => [User])
  data!: User[];
}

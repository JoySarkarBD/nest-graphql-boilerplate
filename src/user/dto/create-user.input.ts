import { Field, InputType } from '@nestjs/graphql';

/**
 * Input type for creating a new user.
 * Includes fields for name and email.
 * @class CreateUserInput
 * @property {string} name - Name of the user.
 * @property {string} email - Email address of the user.
 */
@InputType()
export class CreateUserInput {
  @Field({ description: 'Name of the user' })
  name!: string; // Name of the user

  @Field({ description: 'Email address of the user' })
  email!: string; // Email address of the user
}

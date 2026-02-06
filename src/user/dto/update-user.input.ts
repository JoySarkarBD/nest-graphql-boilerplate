import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

/**
 * Input type for updating an existing user.
 * Extends CreateUserInput with an additional id field.
 * @class UpdateUserInput
 * @property {string} id - Unique identifier for the user to be updated.
 */
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID, {
    description: 'Unique identifier for the user to be updated',
  })
  id!: string; // Unique identifier for the user to be updated
}

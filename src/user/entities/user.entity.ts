import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document; // Mongoose Document type

/**
 * User entity representing a user in the system.
 * Includes GraphQL ObjectType and Mongoose Schema definitions.
 * @class User
 * @extends Document
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - Name of the user.
 * @property {string} email - Email address of the user.
 */
@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  id!: string; // Unique identifier for the user

  @Prop({ required: true })
  @Field()
  name!: string; // Name of the user

  @Prop({ required: true, unique: true })
  @Field()
  email!: string; // Email address of the user
}

export const UserSchema = SchemaFactory.createForClass(User);

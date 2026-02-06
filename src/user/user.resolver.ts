import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  UserResponse,
  UsersResponse,
} from 'src/common/graphql/user/users.response';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

/**
 * Resolver for User entity.
 * Handles GraphQL queries and mutations related to users.
 * @class UserResolver
 */
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {} // Injecting UserService

  /**
   * Creates a new user.
   * @param {CreateUserInput} createUserInput - Input data for creating a user.
   * @returns {Promise<User>} The created user.
   * @mutation
   */
  @Mutation(() => UserResponse, { name: 'createUser' })
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserResponse> {
    const user = await this.userService.create(createUserInput);
    return {
      statusCode: 200,
      success: true,
      message: 'User created successfully',
      timestamp: new Date().toISOString(),
      data: user,
    };
  }

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>} List of all users.
   * @query
   */
  @Query(() => UsersResponse, { name: 'users' })
  async findAll(): Promise<UsersResponse> {
    const users = await this.userService.findAll();
    return {
      statusCode: 200,
      success: true,
      message: 'Users retrieved successfully',
      timestamp: new Date().toISOString(),
      data: users,
    };
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User | null>} The user if found, otherwise null.
   * @query
   */
  @Query(() => UserResponse, { name: 'user', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    const user = await this.userService.findOne(id);
    return {
      statusCode: user ? 200 : 404,
      success: !!user,
      message: user ? 'User retrieved successfully' : `User ${id} not found`,
      timestamp: new Date().toISOString(),
      data: user,
    };
  }

  /**
   * Updates an existing user.
   * @param {UpdateUserInput} updateUserInput - Input data for updating a user.
   * @returns {Promise<User>} The updated user.
   * @mutation
   */
  @Mutation(() => UserResponse, { name: 'updateUser' })
  async update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const user = await this.userService.update(
      updateUserInput.id,
      updateUserInput,
    );
    return {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      timestamp: new Date().toISOString(),
      data: user,
    };
  }

  /**
   * Removes a user by ID.
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<User>} The removed user.
   * @mutation
   */
  @Mutation(() => UserResponse, { name: 'removeUser' })
  async remove(@Args('id', { type: () => ID }) id: string) {
    const user = await this.userService.remove(id);
    return {
      statusCode: 200,
      success: true,
      message: 'User removed successfully',
      timestamp: new Date().toISOString(),
      data: user,
    };
  }
}

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

/**
 * Root application module.
 *
 * Imports necessary modules and configures database and GraphQL settings.
 * Provides application-wide services and controllers.
 * @module AppModule
 */
@Module({
  imports: [
    // Connect to local MongoDB instance and use database named `graphQL`.
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'graphQL',
    }),
    // Configure GraphQL (Apollo driver) and generate schema at `src/schema.gql`.
    GraphQLModule.forRoot({
      driver: ApolloDriver, // Disable playground in favor of Apollo Sandbox
      playground: false, // Enable Apollo Sandbox
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Path to generated schema file
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use local default landing page
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

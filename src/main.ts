import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the NestJS application instance using the root AppModule.
  const app = await NestFactory.create(AppModule);
  // Start the server on the specified port or default to 3000.
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT ?? 3000}/graphql`,
    );
  });
}
bootstrap();

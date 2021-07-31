import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  /**
   * Load environment variables from .env file on root folder
   */
  config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}
bootstrap();

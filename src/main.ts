import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  /**
   * Load environment variables from .env file on root folder
   */
  config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap();

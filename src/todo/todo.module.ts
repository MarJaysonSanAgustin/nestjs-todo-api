import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { todoProvider } from './todo.provider';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [DatabaseModule],
  providers: [TodoService, todoProvider],
  controllers: [TodoController],
})
export class TodoModule {}

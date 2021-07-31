import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTodoDTO, Todo } from './todo.schema';
import { TodoService } from './todo.service';
import { Response } from 'express';

@Controller('todos')
export class TodoController {

  constructor (private readonly todoService: TodoService) {}

  @Post()
  async create (@Body() createTodoDTO: CreateTodoDTO, @Res() res: Response) {
    const createdTodo = await this.todoService.create(createTodoDTO);
    return res
      .status(HttpStatus.CREATED)
      .json({
        status: HttpStatus.CREATED,
        items: plainToClass(Todo, createdTodo.toObject()),
      })
      .end();
  }

  @Get()
  async findAll (@Res() res: Response) {
    const todos = await this.todoService.find();
    const serializedTodos = plainToClass(Todo, todos?.map(todo => todo.toObject()));
    return res
      .status(HttpStatus.OK)
      .json({
        status: HttpStatus.OK,
        items: serializedTodos,
      })
      .end();
  }

}

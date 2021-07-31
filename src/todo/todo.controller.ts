import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateTodoDTO, ModifyTodoDTO, Todo } from './todo.schema';
import { TodoService } from './todo.service';

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

  @Patch(':id')
  async update (@Param('id') todoId: string, @Body() updateTodoDTO: ModifyTodoDTO, @Res() res: Response) {
    const updatedTodo = await this.todoService.update(todoId, updateTodoDTO);
    return res
      .status(HttpStatus.CREATED)
      .json({
        status: HttpStatus.CREATED,
        items: plainToClass(Todo, updatedTodo.toObject()),
      })
      .end();
  }

  @Get()
  async find (@Res() res: Response) {
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

  @Get(':id')
  async get (@Param('id') todoId: string, @Res() res: Response) {
    const todo = await this.todoService.findById(todoId);
    const serializedTodo = plainToClass(Todo, todo?.toObject());
    return res
      .status(HttpStatus.OK)
      .json({
        status: HttpStatus.OK,
        items: serializedTodo,
      })
      .end();
  }

  @Delete(':id')
  async remove (@Param('id') todoId: string, @Res() res: Response) {
    const todo = await this.todoService.remove(todoId);
    const serializedDeletedTodo = plainToClass(Todo, todo.toObject());
    return res
      .status(HttpStatus.OK)
      .json({
        status: HttpStatus.OK,
        items: serializedDeletedTodo,
      })
      .end();
  }

}

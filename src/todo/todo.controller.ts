import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTodoDTO, ModifyTodoDTO, Todo } from './todo.schema';
import { TodoService } from './todo.service';
import { ObjectId } from 'bson';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() createTodoDTO: CreateTodoDTO) {
    const createdTodo = await this.todoService.create(createTodoDTO);
    if (!createdTodo) throw new InternalServerErrorException();

    return plainToClass(Todo, createdTodo.toObject());
  }

  @Patch(':id')
  async update(
    @Param('id') todoId: string,
    @Body() updateTodoDTO: ModifyTodoDTO,
  ) {
    if (!todoId || !ObjectId.isValid(todoId))
      throw new UnprocessableEntityException(`${todoId} is not a valid id.`);

    const updatedTodo = await this.todoService.update(todoId, updateTodoDTO);
    if (!updatedTodo) throw new NotFoundException();

    return plainToClass(Todo, updatedTodo.toObject());
  }

  @Get()
  async find() {
    const todos = await this.todoService.find({});
    const serializedTodos = plainToClass(
      Todo,
      todos?.map((todo) => todo.toObject()),
    );

    return serializedTodos;
  }

  @Get(':id')
  async get(@Param('id') todoId: string) {
    if (!todoId || !ObjectId.isValid(todoId))
      throw new UnprocessableEntityException(`${todoId} is not a valid id.`);

    const todo = await this.todoService.findById(todoId);
    if (!todo) throw new NotFoundException('Todo not found');

    const serializedTodo = plainToClass(Todo, todo?.toObject());
    return serializedTodo;
  }

  @Delete(':id')
  async remove(@Param('id') todoId: string) {
    if (!todoId || !ObjectId.isValid(todoId))
      throw new UnprocessableEntityException(`${todoId} is not a valid id.`);

    const todo = await this.todoService.remove(todoId);
    if (!todo) throw new NotFoundException();

    const serializedDeletedTodo = plainToClass(Todo, todo.toObject());
    return serializedDeletedTodo;
  }
}

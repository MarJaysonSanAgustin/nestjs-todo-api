import { Injectable, Inject } from '@nestjs/common';
import { Model, Document } from 'mongoose';

import { Todo, CreateTodoDTO, ModifyTodoDTO } from './todo.schema';

@Injectable()
export class TodoService {

  constructor(@Inject('TODO_MODEL') private readonly todoModel: Model<Todo>) { }

  async create (createTodoDTO: CreateTodoDTO): Promise<Document<Todo>> {
    const todo = new this.todoModel(createTodoDTO);
    const newTodo = await todo.save();
    return newTodo;
  }

  async find (query: Partial<Todo>): Promise<Document<Todo>[]> {
    const todos = await this.todoModel.find(query);
    return todos;
  }

  async findById (todoId: string): Promise<Document<Todo>> {
    const todo = await this.todoModel.findById(todoId);
    return todo;
  }

  async update (todoId: string, updateTodoDTO: ModifyTodoDTO): Promise<Document<Todo>> {
    const updatedTodo = await this.todoModel
      .findByIdAndUpdate(todoId, { $set: { ...updateTodoDTO } }, { new: true, runValidators: true });
    return updatedTodo;
}

  async remove (todoId: string): Promise<Document<Todo>> {
    const deletedTodo = await this.todoModel.findByIdAndDelete(todoId);
    return deletedTodo;
  }
}

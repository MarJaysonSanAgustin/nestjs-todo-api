import { Injectable, Inject, UnprocessableEntityException, NotFoundException, HttpException } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { ObjectId } from 'bson';

import { Todo, CreateTodoDTO } from './todo.schema';

@Injectable()
export class TodoService {

  constructor(@Inject('TODO_MODEL') private readonly todoModel: Model<Todo>) { }

  async create (createTodoDTO: CreateTodoDTO): Promise<Document<Todo>> {
    try {
      const todo = new this.todoModel(createTodoDTO);
      const newTodo = await todo.save();
      return newTodo;
    } catch (error) {
      throw new HttpException(error?.message || 'Error', error?.status || 500);
    }
  }

  async find (query: object = {}): Promise<Document<Todo>[]> {
    try {
      const todos = await this.todoModel.find(query);
      return todos;
    } catch (error) {
      throw new HttpException(error?.message || 'Error', error?.status || 500);
    }
  }

  async findById (todoId: string): Promise<Document<Todo>> {
    try {
      if (!ObjectId.isValid(todoId)) { throw new UnprocessableEntityException(`${todoId} is not a valid id.`); }

      const todo = await this.todoModel.findById(todoId);
      if (!todo) { throw new NotFoundException(`Not found`); }

      return todo;
    } catch (error) {
      throw new HttpException(error?.message || 'Error', error?.status || 500);
    }
  }

  async update (todoId: string, updateObj: object): Promise<Document<Todo>> {
    try {
      if (!ObjectId.isValid(todoId)) { throw new UnprocessableEntityException(`${todoId} is not a valid id.`); }

      const updatedTodo = await this.todoModel
        .findByIdAndUpdate(todoId, { $set: { ...updateObj } }, { new: true, runValidators: true });
      if (!updatedTodo) { throw new NotFoundException(`Not found`); }

      return updatedTodo;
    } catch (error) {
      throw new HttpException(error?.message || 'Error', error?.status || 500);
    }
  }

  async remove (todoId: string): Promise<Document<Todo>> {
    try {
      if (!ObjectId.isValid(todoId)) { throw new UnprocessableEntityException(`${todoId} is not a valid id.`); }

      const deletedTodo = await this.todoModel.findByIdAndDelete(todoId);
      if (!deletedTodo) { throw new NotFoundException(`Not found`); }

      return deletedTodo;
    } catch (error) {
      throw new HttpException(error?.message || 'Error', error?.status || 500);
    }
  }
}

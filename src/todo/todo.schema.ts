import { Schema } from 'mongoose';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  description: String,
}, { timestamps: true, versionKey: false });

export class Todo {
  title: string;
  isDone: Boolean;
  description?: string;

  @Expose({ name: '_id' })
  id: string;

  @Transform(({ value }) => new Date(value).getTime())
  createdAt: Date;

  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: Date;

  constructor (partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}

export class CreateTodoDTO {
  @IsNotEmpty()
  readonly title: string;

  @IsOptional()
  readonly isDone: Boolean;

  @IsOptional()
  readonly description?: string;
}

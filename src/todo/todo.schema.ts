import { Schema } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    description: String,
  },
  { timestamps: true, versionKey: false },
);

export class Todo {
  title: string;
  isDone: boolean;
  description?: string;

  @Expose({ name: '_id' })
  id: string;

  @Transform(({ value }) => new Date(value).getTime())
  createdAt: Date;

  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: Date;

  constructor(partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}

export class CreateTodoDTO {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsBoolean()
  readonly isDone: boolean;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

export class ModifyTodoDTO {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsBoolean()
  readonly isDone: boolean;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

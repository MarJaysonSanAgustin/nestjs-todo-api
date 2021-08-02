import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { Todo } from './todo.schema';
import { TodoService } from './todo.service';
import { plainToClass } from 'class-transformer';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  const mockTodoService = {
    find() {
      return [];
    },
    create: jest.fn((dto) => {
      return {
        toObject() {
          return plainToClass(Todo, { ...dto });
        },
      };
    }),
    findById: jest.fn((id: string) => {
      const todo = {
        id,
        title: 'Test title',
        isDone: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        toObject() {
          return plainToClass(Todo, { ...todo });
        },
      };
    }),
    remove() {
      return null;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
  });

  describe('create', () => {
    it('should return UnprocessableEntityException', async () => {
      await expect(todoController.create(null)).rejects.toEqual(
        new UnprocessableEntityException('Invalid todo.'),
      );
    });

    it('should create a todo', async () => {
      const todoDTO: Todo = {
        id: '6107e29976a9452c30a272ac',
        title: 'Test title',
        isDone: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(await todoController.create(todoDTO)).toEqual(
        plainToClass(Todo, todoDTO),
      );
    });
  });

  describe('find', () => {
    it('should return an array of todos', async () => {
      const result = [];
      jest.spyOn(todoService, 'find').mockImplementation(async () => result);

      expect(await todoController.find()).toStrictEqual(result);
    });
  });

  describe('get', () => {
    it('should return UnprocessableEntityException for invalid ids', async () => {
      await expect(todoController.get('')).rejects.toEqual(
        new UnprocessableEntityException(` is not a valid id.`),
      );
    });

    it('should return a todo', async () => {
      const result: Todo = {
        id: '6107e29976a9452c30a272ac',
        title: 'Test title',
        isDone: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(await todoController.get('6107e29976a9452c30a272ac')).toEqual(
        plainToClass(Todo, result),
      );
    });
  });

  describe('remove', () => {
    it('should return UnprocessableEntityException for invalid ids', async () => {
      await expect(todoController.remove('')).rejects.toEqual(
        new UnprocessableEntityException(' is not a valid id.'),
      );
    });

    it('should return NotFoundException for empty results', async () => {
      const result = null;
      jest
        .spyOn(todoService, 'findById')
        .mockImplementation(async () => result);

      await expect(
        todoController.remove('6107e29976a9452c30a272ac'),
      ).rejects.toEqual(new NotFoundException());
    });
  });
});

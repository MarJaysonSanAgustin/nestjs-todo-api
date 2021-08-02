import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const MockTodoService = {
  find() {
    return [];
  },
  findById() {
    return null;
  },
  remove() {
    return null;
  },
};

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [TodoService],
    })
      .overrideProvider(TodoService)
      .useValue(MockTodoService)
      .compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
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
        new UnprocessableEntityException(' is not a valid id.'),
      );
    });

    it('should return NotFoundException for empty results', async () => {
      const result = null;
      jest
        .spyOn(todoService, 'findById')
        .mockImplementation(async () => result);

      await expect(
        todoController.get('6107e29976a9452c30a272ac'),
      ).rejects.toEqual(new NotFoundException());
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

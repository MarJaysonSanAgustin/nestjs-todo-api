import { Connection } from 'mongoose';

import { TodoSchema } from './todo.schema';

/**
 * Uses database providers from src/database/database.provider
 */
export const todoProvider = {
  provide: 'TODO_MODEL',
  useFactory: (connection: Connection) => connection.model('todos', TodoSchema),
  inject: ['MongoDB_Cluster0_Connection'],
};

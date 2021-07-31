import { Logger } from '@nestjs/common';

import { createConnection, ConnectionOptions, Promise as MongoDBPromise } from 'mongoose';

const mongoDBLogger = new Logger('MongoDBProviders');

const connectionOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

/**
 * MongoDB Connection Factories
 * Can use multiple database connections
 */
export const databaseProviders = [
  {
    provide: 'MongoDB_Cluster0_Connection',
    useFactory: async () => {
      MongoDBPromise.Promise = global.Promise;

      const connection = await createConnection(process.env.MONGO_CLUSTER_CONNECTION, connectionOptions);

      if (connection) {
        mongoDBLogger.log('MongoDB_Cluster0_Connection: Ready');
        return connection;
      }
    },
  },
];

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';

import User from './models/user-model.js';
import resolvers from './resolvers.js';
import { GraphQLError } from 'graphql';

dotenv.config();

const DB_URI = process.env.DATABASE_URI || '';
const PORT = process.env.PORT || 8000;

interface Context {
  currentUser: unknown,
}

const getUser = async (auth: string) => {
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const currentUser = jwt.verify(auth.substring(7), process.env.JWT_SECRET, async (err, res) => {
        if (err) return new GraphQLError('Invalid auth token');
        else {
          const decoded = res as jwt.JwtPayload;
          const user = await User.findById(decoded.id);
          return user;
        }
      });
      return currentUser;
  } else {
    return { role: 'guest' };
  }
};

export const connectDB = (db_uri: string) => {
    mongoose.connect(db_uri, (error) => {
      if (error) {
        console.log(error);
        return undefined;
      } else {
        console.log('Connected to database');
        return mongoose.connection;
      }
    });
};

async function startApolloServer() {
  try {
    connectDB(DB_URI);
  
    const app = express();
    const httpServer = http.createServer(app);
    
    const typeDefs = readFileSync('./src/schema.graphql', { encoding: 'utf-8'});
    
    const server = new ApolloServer<Context>({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    
    await server.start();
    
    app.use(
      '/graphql',
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          const auth = req ? req.headers.authorization : null;
          const currentUser = await getUser(auth);
          console.log(currentUser);
          return { currentUser };
        }
      }),
    );
    
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}

await startApolloServer();
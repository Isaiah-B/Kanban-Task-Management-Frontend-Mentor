import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import User from './models/user-model';
import typeDefs from './schema';
import resolvers from './resolvers';

dotenv.config();

const DB_URI = process.env.DATABASE_URI || '';
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || '';

interface Context {
  currentUser: unknown,
}

const getUser = async (auth: string | undefined) => {
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const currentUser = jwt.verify(auth.substring(7), JWT_SECRET, async (err, res) => {
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
          const auth = req ? req.headers.authorization : undefined;
          const currentUser = await getUser(auth);
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

startApolloServer();
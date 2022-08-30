import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { DocumentNode } from 'graphql';
import express from 'express';
import bodyParser from 'body-parser'
import * as http from 'http';
import typeDefs from './schema'
import resolvers from './resolvers'
import router from './router'
import * as T from './types'
import { cors } from './utils/cors'

async function startApolloServer(typeDefs: DocumentNode, resolvers: T.Obj) {
  const app = express();
  app.use(cors);
  app.use(bodyParser.json())
  app.use(`/`, router)

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
}

startApolloServer(typeDefs, resolvers)

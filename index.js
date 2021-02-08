require('dotenv').config();
const port = process.env.PORT || 4000;

const express = require('express');
//These are our DB models. They are exposed from models/index.js
const models = require('./models');
 
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  context: {models},
  });

  server.applyMiddleware({ app });

// The `listen` method launches a web server.
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
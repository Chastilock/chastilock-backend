require('dotenv').config();
const port = process.env.PORT || 4000;

const express = require('express');
//These are our DB models. They are exposed from models/index.js
const models = require('./models');
 
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const { CheckApp, CheckAuth } = require('./middleware');
const bodyParser = require('body-parser');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {req, models}
  }
  }
);

app.use(bodyParser.json());
app.use(CheckApp);
app.use(CheckAuth);

server.applyMiddleware({ app });

app.use((req, res) => {
  res.status(200).send('Hello from GraphQL server! 👋🏻');
  res.end();
});

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
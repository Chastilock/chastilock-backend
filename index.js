require('dotenv').config();
const port = process.env.PORT || 4000;

const express = require('express');
const bree = require('./jobSetup');
//These are our DB models. They are exposed from models/index.js
const models = require('./models');
 
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const CheckApp = require('./middleware/CheckApp');
const CheckAuth = require('./middleware/CheckAuth');
const rateLimiter = require('./middleware/rateLimiter') 
const bodyParser = require('body-parser');
const loadLock = require('./web/resolvers/loadLock');
const activateEmail = require('./web/resolvers/activateEmail');
const passwordReset = require('./web/resolvers/passwordReset');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

async function startServer() {
  
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return {req, models}
    },
    csrfPrevention: true,
    plugins: [
      process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground()
    ]
    }
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true}));
  app.use(rateLimiter);
  app.use(CheckApp);
  app.use(CheckAuth);

  app.set('views', './web/views');
  app.set('view engine', 'pug');

  app.get('/lock/:lockid', async function(req, res) {
    await loadLock(req, res);
  })

  app.get('/activate/:code', async function(req, res) {
    await activateEmail(req, res);
  })

  app.get('/passwordreset/:code/:email', async function(req, res) {
    await passwordReset(req, res);
  })

  app.post('/passwordreset/:code/:email', async function(req, res) {
    await passwordReset(req, res);
  })

  app.use("/static", express.static('public'));

  app.get("/", (req, res) => {
    res.status(200).send('Hello from GraphQL server! 👋🏻');
    res.end();
  });

  app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
  await server.start();
  server.applyMiddleware({ app });
}

startServer();
bree.start();
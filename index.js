require('dotenv').config();
const port = process.env.PORT || 4000;

const pug = require("pug");

const express = require('express');
const bree = require('./jobSetup');
//These are our DB models. They are exposed from models/index.js
const models = require('./models');
 
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const CheckApp = require('./middleware/CheckApp');
const CheckAuth = require('./middleware/CheckAuth');
const rateLimiter = require('./middleware/rateLimiter') 
const bodyParser = require('body-parser');
const loadlock = require('./web/resolvers/loadlock');
const activateemail = require('./web/resolvers/activateemail');

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
app.use(rateLimiter);
app.use(CheckApp);
app.use(CheckAuth);

app.set('views', './web/views');
app.set('view engine', 'pug');

app.use('/lock/:lockid', async function(req, res) {
  await loadlock(req, res);
})

app.use('/activate/:code', async function(req, res) {
  await activateemail(req, res);
})

app.use("/static", express.static('public'))

server.applyMiddleware({ app });

app.use("/", (req, res) => {
  res.status(200).send('Hello from GraphQL server! 👋🏻');
  res.end();
});

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)

bree.start();
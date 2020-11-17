const port = 4000;

//These are our DB models. They are exposed from models/index.js
const models = require('./models');
 
const { ApolloServer } = require('apollo-server');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');



// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers, context: {models} });

// The `listen` method launches a web server.
server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
require('dotenv').config();
const port = process.env.PORT || 4000;

const express = require('express');
//These are our DB models. They are exposed from models/index.js
const models = require('./models');
 
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const CheckApp = require('./middleware/CheckApp');
const CheckAuth = require('./middleware/CheckAuth');
const rateLimiter = require('./middleware/rateLimiter') 
const bodyParser = require('body-parser');
const { CreatedLock } = require('./models');
const { QRAsDataURL } = require('./helpers/qr');

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


app.set('views', './web');
app.set('view engine', 'pug');

app.use('/lock/:lockid', async function(req, res) {
  
  const LockID = req.params.lockid
  
  const LockSearch = await CreatedLock.findOne({
    where: {
      Shared_Code: LockID,
      Shared: 1
    }
  })

  if(LockSearch) {

    const QR = await QRAsDataURL(LockID);
    console.log(QR)

    res.render("loadlock", {
      LockName: LockSearch.Lock_Name,
      QR
    });
  } else {
    res.end("Lock not found!", 404)
  }
  
  
  
  //res.send(`LockID is ${LockID}`);
  
})

server.applyMiddleware({ app });

app.use((req, res) => {
  res.status(200).send('Hello from GraphQL server! 👋🏻');
  res.end();
});

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
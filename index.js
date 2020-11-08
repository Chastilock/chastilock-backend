const express = require('express');
const app = express();
const port = 3000;

const api1Routes = require('./routes/api1');

app.use('/api/1.0', api1Routes);

app.use((req, res) => {
  res.status(200).json({
      message: 'Hello from the REST API!',
  });
});

app.listen(port);
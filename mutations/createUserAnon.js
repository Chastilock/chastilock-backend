const { v4: uuidv4 } = require('uuid');
const {checkAppTokens} = require("../helpers/authentication");
const { AuthenticationError } = require('apollo-server-express');

async function createUserAnon(models, req) {

  if (req.AppFound === false) {
    throw new AuthenticationError("App does not exist");
  }

  const UUID = uuidv4();
  return models.User.create({UUID});
}

module.exports = createUserAnon
const { createSourceEventStream } = require('graphql');
const { v4: uuidv4 } = require('uuid');
const {checkAppTokens} = require("../helpers/authentication");
const { AuthenticationError } = require('apollo-server');

async function createUserAnon({ APIKey, APISecret }, models) {

  console.log("Create user init");

  //First we need to check if the APIKey and APISecret exist in our database
  console.log("Searching for App Key and Secret");
  const AppSearch = await checkAppTokens(APIKey, APISecret);

  if (AppSearch) {
    console.log("App found");
  } else {
    console.log("Unauthorised");
    throw new AuthenticationError("App does not exist");
  }

  const UUID = uuidv4();
  const Created = Math.floor(Date.now() / 1000)
  return models.User.create({UUID, Created});
}

module.exports = createUserAnon
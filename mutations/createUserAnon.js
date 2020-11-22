const { createSourceEventStream } = require('graphql');
const {App} = require('../models');
const { v4: uuidv4 } = require('uuid');

async function createUserAnon({ APIKey, APISecret }, models) {

  console.log("Create user init");

  //First we need to check if the APIKey and APISecret exist in our database
  console.log("Searching for App Key and Secret");
  const AppSearch = await App.findOne({
    where: {
      API_Key: APIKey,
      API_Secret: APISecret
    }
  })

  if (AppSearch) {
    console.log("App found");
  } else {
    console.log("Unauthorised");
    return "Not found";
  }

  
  const UUID = uuidv4();
  const Created = Math.floor(Date.now() / 1000)
  return models.User.create({UUID, Created});

}

module.exports = createUserAnon
const { createSourceEventStream } = require('graphql');
const {User, App} = require('../models');

async function createUser({ APIKey, APISecret, Email, Password, Username }) {
//First we need to check if the APIKey and APISecret exist in our database

const AppSearch = await App.findOne({
  where: {
    API_Key: APIKey,
    API_Secret: APISecret
  }
})

if (AppSearch) {
  return "Found!";
} else {
  return "Error!"
}

}
module.exports = createUser;
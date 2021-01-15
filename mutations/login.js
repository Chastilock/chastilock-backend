const { generateJWT } = require('../helpers/authentication');
const {AuthenticationError} = require('apollo-server');
const Bcypt = require('bcryptjs');

async function login({ APIKey, APISecret, Username, Password }, models) {
console.log("Searching for App Key and Secret");
  const appSearch = await models.App.findOne({
    where: {
      API_Key: APIKey,
      API_Secret: APISecret
    }
  })

  if (appSearch) {
    console.log("App found");
  } else {
    throw new AuthenticationError('App does not exist');
  }

  const userSearch = await models.User.findOne({
    where: {
      Username: Username
    }
  });

  if(!userSearch) {
    throw new AuthenticationError("Username or password is incorrect - USERNAME");
  }

  const hash = userSearch.Password;

  //Check Password
  if(Bcypt.compareSync(Password, hash) === false) {
    throw new AuthenticationError("Username or password is incorrect - PASSWORD");
  }
  
  return models.Session.create({
    User_ID: userSearch.User_ID,
    Token: generateJWT(userSearch.UUID),
    App_ID: appSearch.App_ID
    });
  }
module.exports = login;
const { generateJWT } = require('../helpers/authentication');
const {AuthenticationError} = require('apollo-server-express');
const Bcypt = require('bcryptjs');

async function login({ Username, Password }, models, req) {

  if (req.AppFound === false) {
    throw new AuthenticationError('App does not exist');
  }

  const userSearch = await models.User.findOne({
    where: {
      Username: Username
    }
  });

  if(!userSearch) {
    throw new AuthenticationError("Username or password is incorrect");
  }

  const hash = userSearch.Password;

  //Check Password
  if(Bcypt.compareSync(Password, hash) === false) {
    throw new AuthenticationError("Username or password is incorrect");
  }
  
  return models.Session.create({
    User_ID: userSearch.User_ID,
    Token: generateJWT(userSearch.UUID),
    App_ID: appSearch.App_ID
    });
  }
module.exports = login;
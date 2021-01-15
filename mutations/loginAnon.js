const { generateJWT, CheckUserPasswordEnabled } = require('../helpers/authentication');
const {AuthenticationError, ForbiddenError} = require('apollo-server');

async function loginAnon({ APIKey, APISecret, UUID }, models) {
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

  const UserSearch = await models.User.findOne({
    where: {
      UUID: UUID
    }
  });

  //Validation
  if(await CheckUserPasswordEnabled(UUID)) {
    throw new ForbiddenError("You are not permitted to login with UUID");
  }

  if(UserSearch) {
    return models.Session.create({
      User_ID: UserSearch.User_ID,
      Token: generateJWT(UUID),
      App_ID: appSearch.App_ID
    });
  }
}
module.exports = loginAnon;
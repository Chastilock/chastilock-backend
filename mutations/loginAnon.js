const { generateJWT, CheckUserPasswordEnabled } = require('../helpers/authentication');
const {AuthenticationError, ForbiddenError, UserInputError} = require('apollo-server-express');

async function loginAnon({ UUID }, models, req) {

  if (req.AppFound === false) {
    throw new AuthenticationError('App does not exist');
  }

  const UserSearch = await models.User.findOne({
    where: {
      UUID: UUID
    }
  });

  if(UserSearch) {

    if(await CheckUserPasswordEnabled(UUID)) {
      throw new ForbiddenError("You are not permitted to login with UUID");
    }
    
    const newSession = await models.Session.create({
      User_ID: UserSearch.User_ID,
      Token: generateJWT(UUID),
      App_ID: req.AppID
    });

    newSession.User = UserSearch;
    return newSession;
  } else {
    throw new UserInputError("UUID not found");
  }
}
module.exports = loginAnon;
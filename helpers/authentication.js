const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { App, User, Session } = require('../models');

function generateJWT(UserUUID) {
  const token = jwt.sign({ UserUUID }, process.env.JWT_SECRET);
  return token;
}

async function verifyJWT(Token) {
  try {
    const decoded = jwt.verify(Token, process.env.JWT_SECRET);
    return decoded.UserUUID;
  } catch (e) {
    return null;
  }
}

/* async function checkAppTokens(APIKey, APISecret) {
  const AppSearch = await App.findOne({
    where: {
      API_Key: APIKey,
      API_Secret: APISecret
    }
  });
  if(AppSearch) {
    return true;
  } else {
    return false;
  }
} */

async function CheckUserPasswordEnabled(UserUUID) {
  const UserSearch = await User.findOne({
    where: {
      UUID: UserUUID
    }
  });
  if(UserSearch.Email && UserSearch.Password) {
    return true;
  } else {
    return false;
  }
}

async function TranslateUUID(UUID) {
  const userSearch = await models.User.findOne({
    where: {
      UUID: UUID
    }
  });
  if(userSearch) {
    return userSearch.User_ID;
  } else {
    return null
  }
}

async function CheckSession(Token) {
  //First, check that the JWT is valid  
  const CheckToken = await verifyJWT(Token);
  
  if(CheckToken === null) {
    throw new AuthenticationError("Invalid Session");
  }

  const UUIDFromToken = CheckToken.UserUUID;
   
  //We will check the session hasn't been voided
  const SessionSearch = Session.findOne({
    where: {
      Token: Token
    }
  });
  if(!SessionSearch) { //Session has been voided
    throw new AuthenticationError("Invalid Session");
  }
  const UserIDFromSession = SessionSearch.User_ID;

  const UserSearch = User.findOne({
    where: {
      UUID: UUIDFromToken
    }
  });

  if(!UserSearch) {
    throw new AuthenticationError("Invalid Session");
  }

  if(UserSearch.User_ID === UserIDFromSession) {
    return UserIDFromSession;
  } else {
    throw new AuthenticationError("Invalid Session");
  }
}

module.exports = {
  generateJWT,
  CheckUserPasswordEnabled,
  verifyJWT,
  TranslateUUID,
  CheckSession
};
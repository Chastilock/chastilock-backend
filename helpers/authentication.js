const jwt = require('jsonwebtoken');
const { App, User } = require('../models');

function generateJWT(UserUUID) {
  var token = jwt.sign({ UserUUID }, process.env.JWT_SECRET);
  return token;
}

async function checkAppTokens(APIKey, APISecret) {
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
}

async function CheckUserPasswordEnabled(UserUUID) {
  const UserSearch = await User.findOne({
    where: {
      UUID: UserUUID
    }
  });
  if(UserSearch.Email && UserSearch.Password) {
    console.log("true")
    return true;
  } else {
    console.log("false")
    return false;
  }
}

module.exports.checkAppTokens = checkAppTokens;
module.exports.generateJWT = generateJWT;
module.exports.CheckUserPasswordEnabled = CheckUserPasswordEnabled;
//console.log(CheckUserPasswordEnabled("4704bcff-ed32-4c89-9a4f-db7e08d6fde8"));
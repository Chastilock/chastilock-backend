const jwt = require('jsonwebtoken');
const {App} = require('../models');

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
module.exports.checkAppTokens = checkAppTokens;
module.exports.generateJWT = generateJWT;

const jwt = require('jsonwebtoken');
const { User } = require('../models');

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

module.exports = {
  generateJWT,
  CheckUserPasswordEnabled,
  verifyJWT,
  TranslateUUID
};
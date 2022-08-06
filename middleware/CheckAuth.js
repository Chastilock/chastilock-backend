const { Session } = require('../models');
const jwt = require('jsonwebtoken');

const CheckAuth = async (req, res, next) => {
  let HTTPtoken = "";
  const authorization = req.headers.authorization;
  
  if(typeof authorization === "undefined") {
    req.Authenticated = false;
    return next();
  } else {
    HTTPtoken = authorization.split(" ")[1];
  }
  //First, lets check we can verify the token 
  if(HTTPtoken != "testtoken" && HTTPtoken != "testtoken2") { //TODO: this needs removing before full release
    let decoded;
    try {
      decoded = jwt.verify(HTTPtoken, process.env.JWT_SECRET);
    } catch(err) {
      req.Authenticated = false;
      return next();
    }
    if(decoded.UserUUID === null) {
      req.Authenticated = false;
      return next();
    }
  }

  //Next, lets check the token in the database

  const CheckToken = await Session.findOne({
    where: {
      Token: HTTPtoken || ""
    }
  });

  if(CheckToken) {

    if(CheckToken.App_ID === req.AppID) {
      req.Authenticated = CheckToken.User_ID;
      req.token = CheckToken.Token;
      return next();
    }
  }

    req.Authenticated = false;
    return next();
}
module.exports = CheckAuth;
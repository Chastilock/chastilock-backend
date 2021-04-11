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
    jwt.verify(HTTPtoken, process.env.JWT_SECRET, function(err, decoded) {
      if(decoded === null) {
        req.Authenticated = false;
        return next();
      }
    })

  //Next, lets check the token in the database

  const CheckToken = await Session.findOne({
    where: {
      Token: HTTPtoken || ""
    }
  });

  if(CheckToken) {
    req.Authenticated = CheckToken.User_ID;
    req.token = CheckToken.Token;
    next();
  } else {
    req.Authenticated = false;
    return next();
  }
}
module.exports = CheckAuth;
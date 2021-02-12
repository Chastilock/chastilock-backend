const { App, Session } = require('../models');
const jwt = require('jsonwebtoken');
const CheckApp = async (req, res, next) => {
  
  const AppSearch = await App.findOne({
    where: {
      API_Key: req.body.APIKey || "",
      API_Secret: req.body.APISecret || "" 
    }
  });
  if(AppSearch) {
    req.AppFound = true;
    req.AppID = AppSearch.App_ID
  } else {
    req.AppFound = false;
  }
  next();
}

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
    next();
  } else {
    req.Authenticated = false;
    return next();
  }
}

module.exports = {CheckApp, CheckAuth}
const { App } = require('../models');

const CheckApp = async (req, res, next) => {
  
  const AppSearch = await App.findOne({
    where: {
      API_Key: req.headers['x-api-key'] || "",
      API_Secret: req.headers['x-api-secret'] || "" 
    }
  });

  console.log(req.headers)

  if(AppSearch) {
    req.AppFound = true;
    req.AppID = AppSearch.App_ID;
  } else {
    req.AppFound = false;
  }
  next();
}
module.exports = CheckApp;
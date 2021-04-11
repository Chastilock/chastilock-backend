const { App } = require('../models');

const CheckApp = async (req, res, next) => {
  
  const AppSearch = await App.findOne({
    where: {
      API_Key: req.body.APIKey || "",
      API_Secret: req.body.APISecret || "" 
    }
  });
  if(AppSearch) {
    req.AppFound = true;
    req.AppID = AppSearch.App_ID;
  } else {
    req.AppFound = false;
  }
  next();
}
module.exports = CheckApp;
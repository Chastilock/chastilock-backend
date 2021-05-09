const { v4: uuidv4 } = require('uuid');
const {checkAppTokens} = require("../helpers/authentication");
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');

async function createUserAnon(models, req) {
  const SignupDisabled = await models.AppSetting.findOne({
    where: {
        Setting_Name: "Allow_Signups",
        Setting_Value: "true"
      }
    });
    if (SignupDisabled === null) {
        throw new ForbiddenError("We are currently not accepting new users. Please try again later")
    }


  if (req.AppFound === false) {
    throw new AuthenticationError("App does not exist");
  }

  const UUID = uuidv4();
  const NewUser = await models.User.create({UUID});
  await models.UserSetting.create({User_ID: NewUser.User_ID, Combo_Type: "123", Allow_Duplicate_Characters: true, Show_Combo_To_Keyholder: false, Share_Stats: true});
  return NewUser;
}

module.exports = createUserAnon
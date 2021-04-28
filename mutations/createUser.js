const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server-express');
const Bcypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { ValidateEmail, CheckUsernameAvailable, CheckEmailAvailable } = require("../helpers/validation");

async function createUser(inputs, models, req) {

  const SignupDisabled = await models.AppSetting.findOne({
      where: {
          Setting_Name: "Allow_Signups",
          Setting_Value: "true"
      }
  });
  if (SignupDisabled) {
      throw new ForbiddenError("We are currently not accepting new users. Please try again later")
  }

  if (req.AppFound === false) {
    throw new AuthenticationError("App does not exist");
  }

  const ValidationErrors = [];
  //Validation
  if(!ValidateEmail(inputs.Email)) {
    ValidationErrors.push("Email");
  }

  if(inputs.Username.length < 3 || inputs.Username.length > 30) {
    ValidationErrors.push("Username");
  }

  if(inputs.Password.length < 8) {
    ValidationErrors.push("Password");
  }

  if(ValidationErrors.length) {
    throw new UserInputError("Form inputs are invalid!", {
      invalidArgs: ValidationErrors
    });
  }

  if(await CheckUsernameAvailable(inputs.Username) === false) {
    throw new ApolloError("Username Already Taken", 400);
  }

  if(await CheckEmailAvailable(inputs.Email) === false) {
    throw new ApolloError("Email Already Taken", 400);
  }

  const hashedPassword = Bcypt.hashSync(inputs.Password, 10);
  const UUID = uuidv4();
  const NewUser = await models.User.create({UUID, Email: inputs.Email, Password: hashedPassword, Username: inputs.Username});
  await models.UserSetting.create({User_ID: NewUser.User_ID, Combo_Type: "123", Allow_Duplicate_Characters: true, Show_Combo_To_Keyholder: false, Share_Stats: true});
  return NewUser;

}
module.exports = createUser;
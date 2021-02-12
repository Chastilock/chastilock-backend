const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server-express');
const Bcypt = require('bcryptjs');
const { ValidateEmail, CheckUsernameAvailable, CheckEmailAvailable } = require("../helpers/validation");

async function upgradeAccount(inputs, models, req) {

if(req.AppFound === false) {
  throw new AuthenticationError("App does not exist");
}

if(req.Authenticated === false) {
    throw new AuthenticationError("Session is not valid");
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

const authenticatedUser = await models.User.findOne({
    where: {
        "User_ID": req.Authenticated
    }
});

const hashedPassword = Bcypt.hashSync(inputs.Password, 10);
const DataToSet = {
    Email: inputs.Email,
    Password: hashedPassword,
    Username: inputs.Username
}
authenticatedUser.set(DataToSet);
await authenticatedUser.save();
return authenticatedUser;

}
module.exports = upgradeAccount;
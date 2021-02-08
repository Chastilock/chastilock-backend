const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server-express');
const Bcypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { checkAppTokens } = require("../helpers/authentication");
const { ValidateEmail, CheckUsernameAvailable, CheckEmailAvailable } = require("../helpers/validation");

async function createUser(inputs, models) {
console.log("Create user init");

//First we need to check if the APIKey and APISecret exist in our database
console.log("Searching for App Key and Secret");
const AppSearch = await checkAppTokens(inputs.APIKey, inputs.APISecret);

if (AppSearch) {
  console.log("App found");
} else {
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
const Created = Math.floor(Date.now() / 1000)
return models.User.create({UUID, Email: inputs.Email, Password: hashedPassword, Username: inputs.Username, Created});

}
module.exports = createUser;
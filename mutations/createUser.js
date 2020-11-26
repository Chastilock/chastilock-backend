const { createSourceEventStream } = require('graphql');
const Bcypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {checkAppTokens} = require("../helpers/authentication");


async function createUser({ APIKey, APISecret, Email, Password, Username }, models) {
console.log("Create user init");

//First we need to check if the APIKey and APISecret exist in our database
console.log("Searching for App Key and Secret");
const AppSearch = await checkAppTokens(APIKey, APISecret);

if (AppSearch) {
  console.log("App found");
} else {
  console.log("Unauthorised");
  return "Not found";
}

const hashedPassword = Bcypt.hashSync(Password, 10);
const UUID = uuidv4();
const Created = Math.floor(Date.now() / 1000)
return models.User.create({UUID, Email, Password: hashedPassword, Username, Created});

}
module.exports = createUser;
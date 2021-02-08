const { checkAppTokens, CheckSession } = require("../helpers/authentication");
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Bcypt = require('bcryptjs');

async function changePassword(inputs, models) {
    //First we need to check if the APIKey and APISecret exist in our database
    console.log("Searching for App Key and Secret");
    const AppSearch = await checkAppTokens(inputs.APIKey, inputs.APISecret);

    if (AppSearch) {
    console.log("App found");
    } else {
        throw new AuthenticationError("App does not exist");
    }

    const UserID = await CheckSession(inputs.Token);
    //Get user ID from Token
    console.log(UserID);
    if(UserID) {
        console.log("Validated Token");
    } else {
        throw new AuthenticationError("Session not valid");
    }

    if(inputs.NewPassword.length < 8) {
        throw new UserInputError("New Password not valid")
      }

    const userSearch = await models.User.findOne({
        where: {
          User_ID: UserID
        }
      });
    const hash = userSearch.Password;
    //We need to check the old password
    if(Bcypt.compareSync(inputs.OldPassword, hash) === false) {
        throw new AuthenticationError("Old password is incorrect");
    }

    //Set the password on the previously retrieved user account
    const NewHashedPassword = Bcypt.hashSync(inputs.Password, 10);
    const DataToSet = {
        Password: NewHashedPassword
    }
    userSearch.set(DataToSet);
    userSearch.save();
    return userSearch;

}
module.exports = changePassword;
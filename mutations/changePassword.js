const { AuthenticationError, UserInputError } = require('apollo-server-express');
const Bcypt = require('bcryptjs');

async function changePassword(inputs, models, req) {
    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    if(inputs.NewPassword.length < 8) {
        throw new UserInputError("New Password not valid")
      }

    const userSearch = await models.User.findOne({
        where: {
          User_ID: req.Authenticated
        }
      });
    const hash = userSearch.Password;
    console.log(`Hash: ${hash}`)
    console.log(`Old Password: ${inputs.OldPassword}`)
    //We need to check the old password
    if(Bcypt.compareSync(inputs.OldPassword, hash) === false) {
        throw new AuthenticationError("Old password is incorrect");
    }

    //Set the password on the previously retrieved user account
    const NewHashedPassword = Bcypt.hashSync(inputs.NewPassword, 10);
    const DataToSet = {
        Password: NewHashedPassword
    }
    userSearch.set(DataToSet);
    userSearch.save();
    return userSearch;

}
module.exports = changePassword;
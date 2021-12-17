const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server-express');
const { ValidateEmail } = require('../helpers/validation');
const { v4: uuidv4 } = require('uuid');
const sendemail = require("../helpers/email.js")

async function requestPasswordChange(inputs, models, req) {

    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if(ValidateEmail(inputs.Email) === false) {
        throw new UserInputError("You must supply a valid email address");
    }

    const UserSearch = await models.User.findOne({
        where: {
            Email: inputs.Email
        }
    });

    if(UserSearch) {

        const Expiry = new Date();
        Expiry.setHours(Expiry.getHours() + 2);

        const record = await models.PasswordReset.create({
            User_ID: UserSearch.User_ID,
            Code: uuidv4(),
            Expires: Expiry
        });

        sendemail(UserSearch.User_ID, "ForgottenPassword", {code: record.Code});
        return record;
    } else {
        throw new UserInputError("Email address not found");
        //TODO: Need to think about if this needs improving in any way
    }

}

module.exports = requestPasswordChange;
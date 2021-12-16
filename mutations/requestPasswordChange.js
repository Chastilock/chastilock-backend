const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server-express');
const { ValidateEmail } = require('../helpers/validation');
const { v4: uuidv4 } = require('uuid');
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

        const record = models.PasswordReset.create({
            User_ID: UserSearch.User_ID,
            Code: uuidv4(),
            Expires: Expiry
        });

        //Need to send the password reset email here!!!
        
        return record;
    } else {
        throw new UserInputError("Email address not found");
        //TODO: Need to think about if this needs improving in any way
    }

}

module.exports = requestPasswordChange;
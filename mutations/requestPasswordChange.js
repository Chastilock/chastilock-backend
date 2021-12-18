const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server-express');
const { ValidateEmail } = require('../helpers/validation');
const { v4: uuidv4 } = require('uuid');
const sendemail = require("../helpers/email.js");
const { Op } = require('sequelize');

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

        const Time5MinsAgo = new Date();
        Time5MinsAgo.setMinutes(Time5MinsAgo.getMinutes() - 5);

        const Last5Mins = await models.PasswordReset.findOne({
            where: {
                Last_Emailed: {
                    [Op.gt]: Time5MinsAgo
                }
            }
        });

        if(Last5Mins) {
            throw new UserInputError("We sent you an email within the last 5 minutes, please wait a little before retrying!");
        }

        const now = new Date();
        const PasswordResetSearch = await models.PasswordReset.findOne({
            where: {
                [Op.and]: {
                    User_ID: {
                        [Op.eq]: UserSearch.User_ID
                    },
                    Expires: {
                        [Op.gt]: now
                    }
                }
            }
        })

        let record = "";

        if(PasswordResetSearch) {
            record = PasswordResetSearch
            record.set({
                Last_Emailed: now
            });
            record.save();
        } else {
            const Expiry = new Date();
            Expiry.setHours(Expiry.getHours() + 2);
            
            record = await models.PasswordReset.create({
                User_ID: UserSearch.User_ID,
                Code: uuidv4(),
                Expires: Expiry,
                Last_Emailed: now
            });
        }
        sendemail(UserSearch.User_ID, "ForgottenPassword", {code: record.Code});
        return record;
    } else {
        throw new UserInputError("Email address not found");
        //TODO: Need to think about if this needs improving in any way
    }
}

module.exports = requestPasswordChange;
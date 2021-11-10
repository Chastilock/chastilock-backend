const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { checkNotificationToken } = require('../helpers/notifications');


async function registerNotifictions(inputs, models, req) {

    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    if(!checkNotificationToken(inputs.NotificationToken)) {
        throw new UserInputError("Notification token is invalid");

    }

    const session = await models.Session.findOne({
        where: {
            Token: req.token
        }
    });

    session.set({Notification_Token: inputs.NotificationToken})
    return await session.save();
}

module.exports = registerNotifictions;

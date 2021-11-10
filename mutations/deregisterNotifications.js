const { AuthenticationError } = require('apollo-server-express');;


async function deregisterNotifictions(inputs, models, req) {

    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const session = await models.Session.findOne({
        where: {
            Token: req.token
        }
    });

    session.set({Notification_Token: null})
    return await session.save();
}

module.exports = deregisterNotifictions;

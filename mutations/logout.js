const { ApolloError, AuthenticationError } = require("apollo-server-express");

async function Logout(inputs, models, req) {
    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const deleteSession = await models.Session.destroy({
        where: {
            Token: req.token
        }
    });
    if(deleteSession === 1) {
        return "Logged Out";
    } else {
        throw new ApolloError("Failed to logout",500);
    }

}
module.exports = Logout;
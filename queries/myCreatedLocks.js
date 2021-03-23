const { AuthenticationError } = require('apollo-server-express');

async function myCreatedLocks(models, req) {
    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }
    return models.CreatedLock.findAll({
        where: {
            User_ID: req.Authenticated
        }
    });
    
}
module.exports = myCreatedLocks;

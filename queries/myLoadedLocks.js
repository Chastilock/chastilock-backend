const { AuthenticationError } = require('apollo-server-express');

async function myLoadedLocks(models, req) {
    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }
    return models.LoadedLock.findAll({
        where: {
            Lockee: req.Authenticated
        }
    });
    
}
module.exports = myLoadedLocks;

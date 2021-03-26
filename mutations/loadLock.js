const { AuthenticationError } = require('apollo-server-express');

async function loadLock(models, req) {
    const validationErrors = [];

    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    
}

module.exports = loadLock;
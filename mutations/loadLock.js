const { AuthenticationError } = require('apollo-server-express');

async function loadLock(inputs, models, req) {
    const validationErrors = [];

    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    //Find lock that we are going to load!
    const LockSearch = await models.CreatedLock.findOne({
        where: {
            Shared_Code: inputs.ShareCode
        }
    });
    if(LockSearch) {
        console.log("Lock Found")
    } else {
        console.log("Lock not found")

    }
    
}

module.exports = loadLock;
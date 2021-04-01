const { AuthenticationError, ApolloError } = require('apollo-server-express');
const loadOriginalLockType = import('../helpers/loadOriginalLockType');

async function loadLock(inputs, models, req) {

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
    if(!LockSearch) {
        throw new ApolloError("Lock not found", "404");
    }

    if(LockSearch.Disabled === true) {
        throw new ApolloError("Lock has been disabled", "403");
    }

    if(LockSearch.OriginalLockType_ID != null) {
        //Original lock type. Will use helper function to return the lock to keep this file neat!
        loadOriginalLockType(LockSearch);
    }
    
}

module.exports = loadLock;
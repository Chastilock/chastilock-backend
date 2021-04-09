const { AuthenticationError, ApolloError, ForbiddenError } = require('apollo-server-express');
//const loadOriginalLockType = import('../helpers/loadOriginalLockType');

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

    if (LockSearch.Shared === false) {
        //We don't want to give off the impression the lock exists if it's not supposted to be shared.
        throw new ApolloError("Lock not found", "404");
    }

    if(LockSearch.Disabled === true) {
        throw new ForbiddenError("Lock has been disabled");
    }

    const validationErrors = [];

    if(LockSearch.Only_Accept_Trusted === true) {
        if(inputs.Trust_Keyholder === false) {
            validationErrors.push("The keyholder of this lock requires you to trust them");
        }
    }

    if(LockSearch.Allow_Fakes === true) {
       
    }
    
    if(LockSearch.OriginalLockType_ID != null) {
        //Original lock type. Will use helper function to return the lock to keep this file neat!
        //loadOriginalLockType(LockSearch);
    }
    
}

module.exports = loadLock;
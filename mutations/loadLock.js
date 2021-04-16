const { AuthenticationError, ApolloError, ForbiddenError } = require('apollo-server-express');
const loadOriginalLockType = require('../helpers/loadOriginalLockType');

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

    if(inputs.Min_Fakes > 0 || inputs.Max_Fakes > 0) {

        if(LockSearch.Allow_Fakes === false) {
            validationErrors.push("Fakes are not allowed on this lock");
        }

       if(inputs.Min_Fakes > inputs.Max_Fakes) {
        validationErrors.push("Invalid fake lock amounts");
       }

       if(inputs.Min_Fakes < LockSearch.Min_Fakes) {
        validationErrors.push("You need more fake locks to be able to load this lock");
       }

       if(inputs.Max_Fakes > LockSearch.Max_Fakes) {
        validationErrors.push("You need less fake locks to be able to load this lock");
       }

       if(inputs.Emergency_Keys === true) {
        if(LockSearch.Allow_Buyout === false) {
            validationErrors.push("You are not allowed to enable emergency keys on this lock");
        }
       }

       if(LockSearch.Limit_Users === true) {
           const UserLimit = LockSearch.User_Limit_Amount;
           //TODO: Will need to exclude unlocked locks 
           const NumOfLocksLoaded = models.LoadedLock.findAll({
                where: {
                    CreatedLock_ID: LockSearch.Lock_ID
                }
            })

            if(NumOfLocksLoaded.length >= UserLimit) {
                validationErrors.push("The keyholder has set a limit on how many of these locks that can be loaded and the limit has been reached.");
            }
       }

       if(LockSearch.Block_Test_Locks) {
           if(inputs.Test_Lock === true) {
                validationErrors.push("The keyholder does not allow test locks");
           }
       }

       if(LockSearch.Block_User_Rating_Enabled) {
           //TODO: This needs adding once ratings are added
       }

       if(LockSearch.Block_Already_Locked) {
           //TODO: This needs adding once unlocked locks are added
       }
       
       if(LockSearch.Block_Stats_Hidden) {
        //TODO: This needs adding once user settings are added
        }

        if(LockSearch.Only_Accept_Trusted === true) {
            if(inputs.Trust_Keyholder === false) {
                validationErrors.push("The keyholder requires that you trust them");
            }
        }

        if(LockSearch.Require_DM === true) {
            if(inputs.Sent_DM === false) {
                validationErrors.push("The keyholder requires that you speak to them prior to loading this lock. Please refer to where you found the lock for more details.");
            }
        }
    }
    
    if(LockSearch.OriginalLockType_ID != null) {
        //Original lock type. Will use helper function to return the lock to keep this file neat!
        await loadOriginalLockType(LockSearch);
    }
    
}

module.exports = loadLock;
const { AuthenticationError, ApolloError, ForbiddenError, UserInputError } = require('apollo-server-express');
const { getLockeeRating } = require('../helpers/ratings');
const { RandomInt } = require('../helpers/random')
const { createLoadedLock } = require('../helpers/lockLoadingFunctions');
//const { Sequelize } = require('sequelize');
//const { Lock } = require('chastilock-cardgame');
//const { now } = require('sequelize/types/lib/utils');

// TODO: ??? Possibly ??? Should there be a limit on the number of locks that a user can load?
// I think CK app uses 20 as limit.

/*  schema definition as of 6/12
    loadLock(
        ShareCode: String!,          // string - must match a CreatedLock's Shared_Code
        Code: String,                // undefined or string
                                     // allows storage of any code; if provided overrides code generation
        Min_Fakes: Int,              // undefined or an int
        Max_Fakes: Int,              // undefined or an int
        Trust_Keyholder: Boolean!,   // only true or false
        Sent_DM: Boolean,            // undefined or true or false
        Emergency_Keys: Boolean!,    // only true or false
        Emergency_Keys_Amount: Int,  // undefined or an int
        Test_Lock: Boolean!          // only true or false
    ): [LoadedLock!]!                // must return an array containing at least one LoadedLock
*/

async function loadLock(inputs, models, req) {

    const loadLockEnabled = await models.AppSetting.findOne({
        where: {
            Setting_Name: "Allow_LoadLock",
            Setting_Value: "true"
        }
    });
    if (!loadLockEnabled) {
        throw new ForbiddenError("We are currently not accepting new locks to be loaded. Please try again later")
    }

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

    // validate inputs.Code for length? DB type is varchar(255)
    // I'm assuming that Apollo has protection from sql insertion attacks?
    // not sure if it checks for buffer overflows and if so, how it handles them
    // will check here and throw exception
    if (inputs.Code !== undefined) {
        if( inputs.Code.length > 100 ) {
            validationErrors.push("Code must be less than 100 characters");
        }
    }

    if(LockSearch.Only_Accept_Trusted === true) {
        if(inputs.Trust_Keyholder === false) {
            validationErrors.push("The keyholder of this lock requires you to trust them");
        }
    }
/*
    // inputs.Min_Fakes and inputs.Max_Fakes not required to be defined by mutation definition, so...
    // need to test for undefined also, or does this work? It works, but crashes later
    // true if defined and > 0 for both
    // false if undefined or is 0 or less for either.
    // if lockee query requests a range of min:0 to max -20, this check isn't done.
    // if lockee query doesn't include these field, then this is false, and the program crashes in block to create fakes
    if(inputs.Min_Fakes > 0 || inputs.Max_Fakes > 0) {  

        if(LockSearch.Allow_Fakes === false) {
            validationErrors.push("Fakes are not allowed on this lock");
        }
        // ? need else here to deal with the fact that if LockSearch.Allow_Fakes is false,
        // then LockSearch.Min_Fakes and Max_Fakes may be NULL
        // and they could theoretically be NULL if there's a validation oversight when 
        // creating or editting/cloning CreatedLocks
       if(inputs.Min_Fakes > inputs.Max_Fakes) {
        validationErrors.push("Invalid fake lock amounts");
       }

       if(inputs.Min_Fakes < LockSearch.Min_Fakes) {
        validationErrors.push("You need more fake locks to be able to load this lock");
       }

       if(inputs.Max_Fakes > LockSearch.Max_Fakes) {
        validationErrors.push("You need less fake locks to be able to load this lock");
       }

    }

*/
/* Currently in CK, when creating a lock, the corresponding prompt is "Allow copies with fake combinations?"
     Choosing NO - results in "No Fake Copies"
     Choosing YES and using a minimum of zero and a max of X results in "Fake Copies Allowed (Max. X)"
     Choosing YES and using a non-zero minimum of Y and a max of X results in "Y-X Fake Copies Required" 
   When loading a lock the prompt is "Create copies with fake combinations" user is limited based on lock parameters as
    well as the number of locks already loaded.
*/
    let minFakes = 0; // default values if not changed in validation below
    let maxFakes = 0; 
    if( (inputs.Min_Fakes === undefined && inputs.Max_Fakes !== undefined) || 
        (inputs.Min_Fakes !== undefined && inputs.Max_Fakes === undefined) ) {
            validationErrors.push("Max Fakes is required if Min Fakes is provided, and vice versa")
    } 
    if ( inputs.Min_Fakes !== undefined && inputs.Min_Fakes < 0) { // 0 allowed
        validationErrors.push("Minimum Fakes cannot be negative")
    } else {
        minFakes = inputs.Min_Fakes // set to requested value
    }
    if ( inputs.Max_Fakes !== undefined && inputs.Max_Fakes < 0) { // 0 allowed
        validationErrors.push("Maximum Fakes cannot be negative")
    } else {
        maxFakes = inputs.Max_Fakes // set to requested value
    }
    if ( inputs.Min_Fakes !== undefined && inputs.Max_Fakes !== undefined && 
                    inputs.Min_Fakes > inputs.Max_Fakes ) {
        validationErrors.push("Minimum fakes cannot be greater than maximum fakes")
    }

    // TODO: ??? possibly ??? - validate with number of user's pre-existing locks?
 
    // now check against the requirements of the lock
    // at this point minFakes and maxFakes are guaranteed to be defined and have values >= 0 and correspond to 
    // inputs if provided
    if (LockSearch.Allow_Fakes) { // lock allows fakes, but LockSearch.MinFakes and MaxFakes might be null
        // the following error should never occur if code for creating and cloning/editting createdLocks is correct
        if (LockSearch.Min_Fakes === undefined || LockSearch.Max_Fakes === undefined) { // should never happen, but...
            throw new Error("CreatedLock object allows fakes, but doesn't specify minimum and maximum fakes")
        }
        // LockSearch has min and max set if we got here
        // the following could be refactored, but...
        if (LockSearch.Min_Fakes == 0) { // fakes are allowed but not required
            // so inputs are optional
            // locals minFakes and maxFakes were initialized to 0 above and then set above if inputs >= 0, so 
            // just need to check that requested maximum fakes isn't > than the lock's allowed maximum
            if (maxFakes > LockSearch.Max_Fakes) {
                validationErrors.push("Maximum fakes is more than lock's allowed maximum")
            }
        }else { // fakes are required
            if (minFakes < LockSearch.Min_Fakes) {
                validationErrors.push("Minimum fakes is less than lock's required minimum")
            }
            if (maxFakes > LockSearch.Max_Fakes) { 
                validationErrors.push("Maximum fakes is more than lock's allowed maximum")
            }
        }
    } else { //fakes are not allowed
        if (minFakes > 0 || maxFakes > 0) {
            validationErrors.push("The requested lock does not allow fake locks")
        }
    }

    if (inputs.Emergency_Keys === true) { // no validation needed if false
        if(LockSearch.Allow_Buyout === false) {
            validationErrors.push("You are not allowed to enable emergency keys on this lock");
            // no need to validate inputs.Emergency_Keys_Amount
        } else { //lock allows buyout
            // need to validate that inputs.Emergency_Keys_Amount was provided
            if (inputs.Emergency_Keys_Amount === undefined) {
                validationErrors.push("Number of keys must be provided if emerg. keys enabled.");
            } else {
                if (inputs.Emergency_Keys_Amount < 1 ) {
                    validationErrors.push ("Number of keys must be at least one if emerg. keys enabled");
                }
            }
        }
    }

    if(LockSearch.Limit_Users === true) {
        const UserLimit = LockSearch.User_Limit_Amount; // should be defined, but not enforced by DB/model
                                                        // createOriginalLock.js contains code to ensure
        const NumOfLocksLoaded = models.LoadedLock.findAll({
            where: {
                CreatedLock_ID: LockSearch.Lock_ID,
                $and: {Unlocked: false}
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
        const MinRating = LockSearch.Block_User_Rating

        if(await getLockeeRating(req.Authenticated) < MinRating) {
            validationErrors.push("The keyholder needs you to have a higher lockee rating before loading this lock");
        }
    }

    if(LockSearch.Block_Already_Locked) {
        const AlreadyLocked = await models.LoadedLock.findOne({
            where: {
                Lockee: req.Authenticated,
                Unlocked: false
            }
        });
        if(AlreadyLocked != null) {
            validationErrors.push("The keyholder does not allow you to load this alongside other locks");
        }
    }

    // TODO: ??? possibly ??? CK also prevents any lock from loading if 
    // the lockee has already has an existing lock for which Block_Already_Locked is true.
    
    if(LockSearch.Block_Stats_Hidden) {
        const UserSettings = await models.UserSetting.findOne({
            where: {
                User_ID: req.Authenticated
            }
        });
        if(UserSettings.Share_Stats === false) {
            validationErrors.push("The keyholder requires that you share your stats");
        }
    }

    if(LockSearch.Require_DM === true) {
        if(inputs.Sent_DM != true) {
            validationErrors.push("The keyholder requires that you speak to them prior to loading this lock. Please refer to where you found the lock for more details.");
        }
    }

    if(validationErrors.length) {
        throw new UserInputError("Cannot load lock", {
            invalidArgs: validationErrors
            });
    }

    const resultArray = []; 

    /**
     * realLock is the LoadedLock object that is the real lock.
     * @type {LoadedLock} */
    const realLock = createLoadedLock(LockSearch, req.Authenticated, inputs, true);
    resultArray.push(realLock);

    if (minFakes > 0) { // maxFakes will be >= minFakes if exception not thrown in validation
        const NumOfFakes = RandomInt(minFakes, maxFakes);
        for(let i = 0; i < NumOfFakes; i++) {
            /**
             * fakeLock is a LoadedLock object that is a fake lock.
             * @type {LoadedLock} */
            const fakeLock = createLoadedLock(LockSearch, req.Authenticated, inputs, false, realLock.LoadedLock_ID);
            resultArray.push(fakeLock);
        }
    }   

    return resultArray
} 

module.exports = loadLock;
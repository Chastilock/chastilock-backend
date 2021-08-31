const { AuthenticationError, ApolloError, UserInputError } = require('apollo-server-express');
const { unfreezeLock } = require('../helpers/lockModifyingFunctions');
const { LoadedLock, Freeze } = require('../models')

async function KHFreeze(inputs, models, req) {
    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    /** @type { LoadedLock } */
    const LockSearch = await LoadedLock.findByPk(inputs.LoadedLock_ID);

    if(!LockSearch) {
        throw new ApolloError("Lock is not found", 404);
    }

    if(LockSearch.Keyholder != req.Authenticated) {
        throw new AuthenticationError("Access denied");
    }
    const date = (inputs.EndTime) ? parseInt(inputs.EndTime) : undefined

    validationErrors = []

    if (!LockSearch.Trusted) {
        validationErrors.push("Untrusted keyholders cannot freeze the lock")
    } // tested


    if (date) {
        if (date - Date.now() <= 0) {
            validationErrors.push("The end time of a freeze must be in the future")
        }
    } // tested

    if (validationErrors.length) {
        throw new UserInputError("Cannot freeze lock", {
          invalidArgs: validationErrors
        });
      }

    // TODO: ??? Need code here to update chances before freezing lock???  If we're checking chances every 20 seconds
    // with a server job then it's probably not necessary.

    // An already existing current card freeze should be ended
    // An already existing KH freeze should be either be modified or it should be ended and 
    //       new KH freeze created.  Alternatively, a KH could be prevented from KH freezing a 
    //       lock that's already KH frozen.  I chose the modification of existing KH freeze option.
    //       TODO: Is this option OK?
    if (LockSearch.Current_Freeze_ID) { // lock already frozen
        /** @type { Freeze } */
        existingFreeze = await Freeze.findByPk(LockSearch.Current_Freeze_ID)
        if (!existingFreeze) {
            LockSearch.Current_Freeze_ID = null
            await LockSearch.save()
        } else if (existingFreeze.Type == "KH") { // already existing KH freeze, change endTime if provided
            if (date) { // if end date provided, change it
                existingFreeze.EndTime = date
                await existingFreeze.save()
                LockSearch.Last_KH_Change = Date.now()
                await LockSearch.save()
                // tested
            } else if (existingFreeze.EndTime) { //existing Endtime in current KH Freeze, but not in current freeze request
                    existingFreeze.EndTime = null; // remove existing EndTime to match current Freeze request
                    await existingFreeze.save()
                    LockSearch.Last_KH_Change = Date.now()
                    await LockSearch.save()
            } // tested
            return LockSearch // done so return here
        }
        else if (existingFreeze.Type == "Card") { //already existing Card freeze
            await unfreezeLock(LockSearch) // tested
        } else {
            throw Error("Unknown freeze type - neither KH nor Card")
        }

    }
    // tested
    
    // if got here KH froze a lock that was either unfrozen or was previously card frozen 
    // now add the requested KH freeze
    /** @type { Freeze } */
    const theFreeze = await Freeze.create({
        Lock_ID: LockSearch.LoadedLock_ID,
        Type: "KH",
        Started: Date.now(),
        EndTime: date || null
    });
    
    LockSearch.Current_Freeze_ID = theFreeze.Freeze_ID
    LockSearch.Last_KH_Change = Date.now()
    await LockSearch.save();
    // tested
    return LockSearch;

}
module.exports = KHFreeze;

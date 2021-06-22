const { AuthenticationError, ApolloError } = require('apollo-server-express');
const { unfreezeLock } = require('../helpers/lockModifyingFunctions');

async function KHFreeze(inputs, models, req) {
    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const LockSearch = await models.LoadedLock.findOne({
        where: {
            LoadedLock_ID: inputs.LoadedLock_ID
        }
    });

    if(!LockSearch) {
        throw new ApolloError("Lock is not found", 404);
    }

    if(LockSearch.Keyholder != req.Authenticated) {
        throw new AuthenticationError("Access denied");
    }

    validationErrors = []
    //TODO: Need to sort trusted stuff out
    if (!LockSearch.Trusted) {
        validationErrors.push("Untrusted keyholders cannot freeze the lock")
    }
    //TODO: Should probably validate EndTime if provided
    if (inputs.EndTime) {
        if (inputs.EndTime - Date.now() <= 0) {
            validationErros.push("The end time of a freeze must be in the future")
        }
    }
    // not tested

    if (validationErrors.length) {
        throw new UserInputError("Cannot freeze lock", {
          invalidArgs: validationErrors
        });
      }

    // An already existing current card freeze should be ended
    // An already existing KH freeze should be either be modified or it should be ended and 
    //       new KH freeze created.  Alternatively, a KH could be prevented from KH freezing a 
    //       lock that's already KH frozen.  I chose the modification of existing KH freeze option.
    //       TODO: Is this option OK?
    if (LockSearch.Current_Freeze_ID) { // lock already frozen
        existingFreeze = await Freeze.findByPk(LockSearch.Current_Freeze_ID)
        if (!existingFreeze) {
            throw Error ('DB Error: could not find the freeze record')
        }
        if (existingFreeze.Type == "KH") { // already existing KH freeze, change endTime if provided
            if (inputs.EndTime) {
                existingFreeze.EndTime = inputs.EndTime
                await existingFreeze.save()
                LockSearch.Last_KH_Change = Date.now()
                await LockSearch.save()
                return LockSearch // no need to create freeze so return here.
            } 
        }
        else if (existingFreeze.Type == "Card") { //already existing Card freeze
            unfreezeLock(LockSearch)
        }
    }
    // above not yet tested
    
    // now add the requested KH freeze
    const Freeze = await models.Freeze.create({
        Lock_ID = LockSearch.LoadedLock_ID,
        Type: "KH",
        Started: Date.now(),
        EndTime: inputs.EndTime || null
    });
    
    LockSearch.set({
        Current_Freeze_ID: Freeze.Freeze_ID,
        Last_KH_Change: Date.now()
    });
    await LockSearch.save();
    return Freeze;

}
module.exports = KHFreeze;

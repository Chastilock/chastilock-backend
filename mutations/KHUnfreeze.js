const { AuthenticationError, ApolloError, UserInputError } = require('apollo-server-express');

async function KHUnfreeze(inputs, models, req) {

    req.Authenticated = 1; // mock keyholder user for testing

    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    /** @type { LoadedLock } */
    const LockSearch = await models.LoadedLock.findByPk(inputs.LoadedLock_ID)
    /*{
        where: {
            LoadedLock_ID: inputs.LoadedLock_ID
        }
    });*/

    if (!LockSearch) {
        throw new ApolloError("Lock is not found", 404);
    }

    if (LockSearch.Keyholder != req.Authenticated) {
        throw new AuthenticationError("Access denied");
    }

    // No need to check whether keyholder is trusted.
    // This assumes that untrusted keyholders should be able to end card freezes and should be able to end
    // an initial freeze if the lock starts frozen. 

    if (!LockSearch.Current_Freeze_ID) { // no freeze
        throw new UserInputError("Form inputs are invalid!", {
            invalidArgs: ["The lock was not frozen."]
        });
    }

    /** @type { Freeze } */
    const freeze = await models.Freeze.findByPk(LockSearch.Current_Freeze_ID)
    if (!freeze) { // freeze supposed to exist, but not found in DB
        // TODO: ??? fix by setting LockSearch.Current_Freeze_ID = undefined and saving ???
        throw new Error("DB error: Lock is frozen, but freeze does not exist.")
    }
    // record end time, but don't delete freeze record, so we can calculate total freeze time
    freeze.EndTime = Date.now() 
    await freeze.save()
    // unlink the lock from the freeze to unfreeze it
    LockSearch.Current_Freeze_ID = null
    await LockSearch.save()

    return LockSearch
}

module.exports = KHUnfreeze;

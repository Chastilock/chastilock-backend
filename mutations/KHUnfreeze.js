const { AuthenticationError, ApolloError, UserInputError } = require('apollo-server-express');
const { unfreezeLock } = require('../helpers/lockModifyingFunctions');
const { LoadedLock } = require('../models')
const { addMessagesForSingleUser, sendMessages } = require('../helpers/notifications');

async function KHUnfreeze(inputs, models, req) {

    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    /** @type { LoadedLock } */
    const LockSearch = await models.LoadedLock.findByPk(inputs.LoadedLock_ID)

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
        throw new UserInputError("Cannot unfreeze lock", {
            invalidArgs: ["The lock was not frozen."]
        });
    }
    await unfreezeLock(LockSearch) 
    LockSearch.Last_KH_Change = Date.now()
    await LockSearch.save()
    const NotiMessages = []
    NotiMessages = await addMessagesForSingleUser(LockSearch.Lockee, NotiMessages, `Your lock has been unfrozen by your KH`, {view: "myLoadedLocks"});
    sendMessages(NotiMessages);

    return LockSearch
}

module.exports = KHUnfreeze;

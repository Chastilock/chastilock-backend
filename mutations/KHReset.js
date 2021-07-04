const { AuthenticationError, ApolloError, UserInputError } = require('apollo-server-express');
const { hardResetLock } = require('../helpers/lockModifyingFunctions');
const { LoadedLock } = require('../models')

// TODO: If/when trust structure is changed, then the trust code below will need to be revised.

async function KHReset(inputs, models, req) {

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

    validationErrors = []

    // check whether lock shows that keyholder is trusted.
    // if not, then keyholder cannot reset lock
    // TODO: Revise if Trust structure is changed.
    if (LockSearch.Trusted !== true) {
        validationErrors.push("Keyholder resetting lock when not trusted is not allowed")
    }

    // keyholder cannot reset lock if it's already unlocked
    if (LockSearch.Unlocked === true) {
        validationErrors.push("Keyholder resetting lock after lock is unlocked is not allowed")
    }

    if(validationErrors.length) {
        throw new UserInputError("Cannot reset lock", {
            invalidArgs: validationErrors
            });
    }

    await hardResetLock(LockSearch)
    LockSearch.Last_KH_Change = Date.now()
    await LockSearch.save()

    return LockSearch
}

module.exports = KHReset;

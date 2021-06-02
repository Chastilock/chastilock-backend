const { AuthenticationError, ApolloError, ForbiddenError } = require('apollo-server-express');

async function emergencyUnlock(inputs, models, req) {
    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const LockSearch = await models.LoadLock.CreatedLock({
        where: {
            LoadedLock_ID: inputs.LockID
        }
    });

    if(!LockSearch) {
        throw new ApolloError("Lock not found", "404");
    }

    if(LockSearch.Lockee != req.Authenticated) {
        throw new ForbiddenError("Access denied");
    }

    if(LockSearch.Emergency_Keys_Enabled != true) {
        throw new ApolloError("Emergency keys are not allowed on this lock", 401);
    }
    const UserKeys = await LockSearch.getLockee().Emergency_Keys;

    if(UserKeys > LockSearch.Emergency_Keys_Amount) {
        throw new ApolloError("You don't have enough emergency keys to unlock", 401);
    }

    if(LockSearch.Fake_Lock != true) {
        //cont Unlocked = Unlock(inputs.LockID)
        //Find any fake locks of this lock
        const Fakes = models.LoadedLock.get({
            where: {
                Real_Lock: inputs.LockID
            }
        });
        if (Fakes) {
            fakes.forEach(i => {
                //Unlock(i);
            });
        }
        return Unlocked;
    } else {
        const Real_Lock = LoadedLock.getRealLock();
        //const Unlocked = Unlock(Real_Lock);
        const Fakes = models.LoadedLock.get({
            where: {
                Real_Lock: inputs.LockID
            }
        });
        if (Fakes) {
            fakes.forEach(i => {
                //Unlock(i);
            });
        }

        return Unlocked;
    }
}
module.exports = emergencyUnlock;
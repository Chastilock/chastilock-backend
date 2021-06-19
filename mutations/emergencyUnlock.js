const { AuthenticationError, ApolloError, ForbiddenError } = require('apollo-server-express');
//TODO: Test this!!
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
    const User = await LockSearch.getLockee();
    const UserKeys = await User.Emergency_Keys;

    if(UserKeys > LockSearch.Emergency_Keys_Amount) {
        throw new ApolloError("You don't have enough emergency keys to unlock", 401);
    }

    if(LockSearch.Fake_Lock != true) {
        //cont RealLockUnlocked = Unlock(inputs.LockID);
        //Find any fake locks of this lock
        
    } else {
        const Real_Lock = LoadedLock.getRealLock();
        //const RealLockUnlocked = Unlock(Real_Lock);
    }
    const Fakes = models.LoadedLock.findAll({
        where: {
            Real_Lock: inputs.LockID
        }
    });
    if (Fakes) {
        fakes.forEach(i => {
            //Unlock(i);
        });
    }

    User.set({ Emergency_Keys: (UserKeys - Emergency_Keys_Amount) })
    await User.save();

    return RealLockUnlocked;
}
module.exports = emergencyUnlock;
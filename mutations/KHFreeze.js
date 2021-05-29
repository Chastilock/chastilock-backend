const { AuthenticationError, ApolloError } = require('apollo-server-express');

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
    //TODO: Need to sort trusted stuff out

    const Freeze = await models.Freeze.create({
        Type: "KH",
        Started: Date.now(),
        EndTime: inputs.EndTime || null
    });
    
    LockSearch.set({
        Current_Freeze_ID: Freeze.Freeze_ID
    });
    await LockSearch.Save();
    return Freeze;

}
module.exports = KHFreeze;
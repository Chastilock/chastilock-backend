const { AuthenticationError, ApolloError } = require('apollo-server-express');

async function sharedLock(models, req, args) {
    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const LockSearch = await models.CreatedLock.findOne({
        where: {
            Shared_Code: args.id
        }
    });
    if(LockSearch === null) {
        return new ApolloError("Lock not found", "404");
    }
    if(LockSearch.Shared === false) {
        return new ApolloError("Lock not found", "404");
    }
    return LockSearch;
}
module.exports = sharedLock;

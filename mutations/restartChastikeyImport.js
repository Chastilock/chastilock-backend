const { AuthenticationError } = require('apollo-server-express');

async function restartChastikeyImport(inputs, models, req) {
    
    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const Destroy = await models.ChastikeyImport.destroy({
        where: {
            User_ID: req.Authenticated
        }
    });
    if (Destroy) {
        return "Deleted import record successfully";
    } else {
        return "Couldn't delete import record. Maybe there wasn't one there to begin with...";
    }


}
module.exports = restartChastikeyImport;
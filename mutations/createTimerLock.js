const { AuthenticationError, UserInputError } = require('apollo-server-express');
const srs = require('secure-random-string');

async function createTimerLock(inputs, models, req) {
    const validationErrors = [];

    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const MinTimeInMinutes = (inputs.Timer_Min_Days * 1440) + (inputs.Timer_Min_Hours * 60) + (inputs.Timer_Min_Minutes);
    const MaxTimeInMinutes = (inputs.Timer_Max_Days * 1440) + (inputs.Timer_Max_Hours * 60) + (inputs.Timer_Max_Minutes);

    if (MinTimeInMinutes <= 0 || MaxTimeInMinutes <= 0) {
        validationErrors.push("Locks must last at least 1 minute");
    }

    if (MinTimeInMinutes > 525600 || MaxTimeInMinutes > 525600) {
        validationErrors.push("Locks must last no longer than a year");
    }

    if(inputs.Hide_Timer != true && inputs.Hide_Timer != false) {
        validationErrors.push("Hide timer is invalid");
    }

    if(inputs.LockName.length > 255) {
        validationErrors.push("Name too long");
    }

    if(inputs.Auto_Resets_Enabled != false && inputs.Auto_Resets_Enabled != true) {
        validationErrors.push("Auto resets enabled is not valid");
    }
    
    if(inputs.Auto_Resets_Enabled === true) {
        if (inputs.Reset_Frequency < 2 || inputs.Reset_Frequency > 399) {
            validationErrors.push("Reset frequency is not valid");
        }
        if (inputs.Max_Resets < 1 || inputs.Max_Resets > 20) {
            validationErrors.push("Max resets is not valid");
        }
    }

    if(inputs.Checkins_Enabled != false && inputs.Checkins_Enabled != true) {
        validationErrors.push("Checkins enabled is not valid");
    }

    if(inputs.Checkins_Enabled === true) {
        if (inputs.Checkins_Frequency < 0.5 || inputs.Reset_Frequency > 23940) {
            validationErrors.push("Checkins frequency is not valid");
        }

        if (inputs.Checkins_Window < 0.25 || inputs.Checkins_Window > 23880) {
            validationErrors.push("Checkins window is not valid");
        }
    }

    if(inputs.Allow_Buyout != false && inputs.Allow_Buyout != true) {
        validationErrors.push("Allow buyout is not valid");
    }

    if(inputs.Start_Lock_Frozen != false && inputs.Start_Lock_Frozen != true) {
        validationErrors.push("Start lock frozen is not valid");
    }
    if(inputs.Disable_Keyholder_Decision != false && inputs.Disable_Keyholder_Decision != true) {
        validationErrors.push("Disable keyholder permission is not valid");
    }

    if(inputs.Limit_Users != false && inputs.Limit_Users != true) {
        validationErrors.push("Limit users is not valid");
    }

    if(inputs.Limit_Users === true) {
        if(inputs.User_Limit_Amount > 100 || inputs.User_Limit_Amount < 1) {
            validationErrors.push("Limit users amount is not valid");
        }
    }

    if(inputs.Block_Test_Locks != false && inputs.Block_Test_Locks != true) {
        validationErrors.push("Block test users is not valid");
    }

    if(inputs.Block_User_Rating_Enabled != false && inputs.Block_User_Rating_Enabled != true) {
        validationErrors.push("Block user rating enabled is not valid");
    }

    if(inputs.Block_User_Rating_Enabled === true) {
        if(inputs.Block_User_Rating > 5 || inputs.Block_User_Rating < 1) {
            validationErrors.push("User blocked rating is not valid");
        }
    }

    if(inputs.Block_Already_Locked != false && inputs.Block_Already_Locked != true) {
        validationErrors.push("Block already locked users is not valid");
    }

    if(inputs.Block_Stats_Hidden != false && inputs.Block_Stats_Hidden != true) {
        validationErrors.push("Block stat hidden users is not valid");
    }

    if(inputs.Only_Accept_Trusted != false && inputs.Only_Accept_Trusted != true) {
        validationErrors.push("Only accept trusted users is not valid");
    }

    if(inputs.Require_DM != false && inputs.Require_DM != true) {
        validationErrors.push("Require DM is not valid");
    }

    if(validationErrors.length) {
        throw new UserInputError("Form inputs are invalid!", {
          invalidArgs: validationErrors
        });
    }





}
module.exports = createTimerLock;
const { AuthenticationError, UserInputError, ForbiddenError } = require('apollo-server-express');
const srs = require('secure-random-string');
const { validateCommonInputs } = require('../helpers/validatelockcreation')

async function createTimerLock(inputs, models, req) {

    const CreateLockEnabled = await models.AppSetting.findOne({
        where: {
            Setting_Name: "Allow_CreateLock",
            Setting_Value: "true"
        }
    });
    if (!CreateLockEnabled) {
        throw new ForbiddenError("We are currently not allowing new locks to be created. Please try again later")
    }

    const validationErrors = [];

    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    validateCommonInputs(inputs, validationErrors)

    if (inputs.Timer_Min_Days < 0) {
        validationErrors.push("Minimum days cannot be negative.")
    }
    if (inputs.Timer_Min_Hours < 0) {
        validationErrors.push("Minimum hours cannot be negative.")
    }
    if (inputs.Timer_Min_Minutes < 0) {
        validationErrors.push("Minimum minutes cannot be negative.")
    }
    if (inputs.Timer_Max_Days < 0) {
        validationErrors.push("Maximum days cannot be negative.")
    }
    if (inputs.Timer_Max_Hours < 0) {
        validationErrors.push("Maximum hours cannot be negative.")
    }
    if (inputs.Timer_Max_Minutes < 0) {
        validationErrors.push("Maximum minutes cannot be negative.")
    }

    const MinTimeInMinutes = (inputs.Timer_Min_Days * 1440) + (inputs.Timer_Min_Hours * 60) + (inputs.Timer_Min_Minutes);
    const MaxTimeInMinutes = (inputs.Timer_Max_Days * 1440) + (inputs.Timer_Max_Hours * 60) + (inputs.Timer_Max_Minutes);

    if (MinTimeInMinutes <= 0 || MaxTimeInMinutes <= 0) {
        validationErrors.push("Locks must last at least 1 minute");
    }

    if (MinTimeInMinutes > 525600 || MaxTimeInMinutes > 525600) {
        validationErrors.push("Locks must last no longer than a year");
    }

    if (MinTimeInMinutes > MaxTimeInMinutes) {
        validationErrors.push("Minimum lock time cannot be greater than maximum lock time")
    }

    if(inputs.Hide_Timer != true && inputs.Hide_Timer != false) {
        validationErrors.push("Hide timer is invalid");
    }

    if(validationErrors.length) {
        throw new UserInputError("Form inputs are invalid!", {
          invalidArgs: validationErrors
        });
    }

    const TimerRecord = await models.TimerLockType.create({
        Max_Days: inputs.Timer_Max_Days,
        Max_Hours: inputs.Timer_Max_Hours,
        Max_Minutes: inputs.Timer_Max_Minutes,
        Min_Days: inputs.Timer_Min_Days,
        Min_Hours: inputs.Timer_Min_Hours,
        Min_Minutes: inputs.Timer_Min_Minutes,
        Hide_Timer: inputs.Hide_Timer
    })

    const TimerRecordID = TimerRecord.Timer_Type_ID;

    return models.CreatedLock.create({
        User_ID: req.Authenticated,
        Shared: inputs.Shared,
        Shared_Code: srs({length: 20, alphanumeric: true}),
        TimerLockType_ID: TimerRecordID,
        Lock_Name: inputs.LockName, 
        Disabled: 0,
        Allow_Fakes: inputs.Allow_Fakes,
        Min_Fakes: inputs.Min_Fakes,
        Max_Fakes: inputs.Max_Fakes,
        Checkins_Enabled: inputs.Checkins_Enabled,
        Checkins_Frequency: inputs.Checkins_Frequency,
        Checkins_Window: inputs.Checkins_Window,
        Allow_Buyout: inputs.Allow_Buyout,
        Start_Lock_Frozen: inputs.Start_Lock_Frozen,
        Disable_Keyholder_Decision: inputs.Disable_Keyholder_Decision,
        Limit_Users: inputs.Limit_Users,
        User_Limit_Amount: inputs.User_Limit_Amount,
        Block_Test_Locks: inputs.Block_Test_Locks,
        Block_User_Rating_Enabled: inputs.Block_User_Rating_Enabled,
        Block_User_Rating: inputs.Block_User_Rating,
        Block_Already_Locked: inputs.Block_Already_Locked,
        Block_Stats_Hidden: inputs.Block_Stats_Hidden,
        Only_Accept_Trusted: inputs.Only_Accept_Trusted,
        Require_DM: inputs.Require_DM
    });

}
module.exports = createTimerLock;

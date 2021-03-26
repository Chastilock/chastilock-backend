const { AuthenticationError, UserInputError } = require('apollo-server-express');
const srs = require('secure-random-string');

async function createOriginalLock(inputs, models, req) {
    const validationErrors = [];

    if(req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }
    if(req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }
    if(inputs.Variable_Max_Reds > 599 || inputs.Variable_Min_Reds < 0) {
        validationErrors.push("Invalid red card count")
    }
    if(inputs.Variable_Min_Reds > inputs.Variable_Max_Reds) {
        validationErrors.push("Min reds is bigger than max reds")
    }
    if(inputs.Variable_Max_Freezes > 100 || inputs.Variable_Min_Freezes < 0) {
        validationErrors.push("Invalid freeze card count")
    }
    if(inputs.Variable_Min_Freezes > inputs.Variable_Max_Freezes) {
        validationErrors.push("Min freezes is bigger than max freezes")
    }
    if(inputs.Variable_Max_Doubles > 100 || inputs.Variable_Min_Doubles < 0) {
        validationErrors.push("Invalid double card count")
    }
    if(inputs.Variable_Min_Doubles > inputs.Variable_Max_Doubles) {
        validationErrors.push("Min doubles is bigger than max doubles")
    }
    if(inputs.Variable_Max_Stickies > 100 || inputs.Variable_Min_Stickies < 0) {
        validationErrors.push("Invalid Sticky card count")
    }
    if(inputs.Variable_Min_Stickies > inputs.Variable_Max_Stickies) {
        validationErrors.push("Min stickies is bigger than max stickies")
    }
    if(inputs.Variable_Max_AddRed > 299 || inputs.Variable_Min_AddRed < 0) {
        validationErrors.push("Invalid Yellow add card count")
    }
    if(inputs.Variable_Min_AddRed > inputs.Variable_Max_AddRed) {
        validationErrors.push("Min add red is bigger than max add red")
    }
    if(inputs.Variable_Max_RemoveRed > 299 || inputs.Variable_Min_RemoveRed < 0) {
        validationErrors.push("Invalid Yellow remove card count")
    }
    if(inputs.Variable_Min_RemoveRed > inputs.Variable_Max_RemoveRed) {
        validationErrors.push("Min remove red is bigger than max remove red")
    }
    if(inputs.Variable_Max_RandomRed > 299 || inputs.Variable_Min_RandomRed < 0) {
        validationErrors.push("Invalid Yellow random card count")
    }
    if(inputs.Variable_Min_RandomRed > inputs.Variable_Max_RemoveRed) {
        validationErrors.push("Min random red is bigger than max random red")
    }
    if(inputs.LockName.length > 255) {
        validationErrors.push("Name too long");
    }
    if(inputs.Chance_Period > 1440 || inputs.Chance_Period < 1) {
        validationErrors.push("Chance period is not valid");
    }
    if(inputs.Cumaltive != false && inputs.Cumaltive != true) {
        validationErrors.push("Cumalative is not valid");
    }
    if(inputs.Multiple_Greens_Required != false && inputs.Multiple_Greens_Required != true) {
        validationErrors.push("Multiple greens required is not valid");
    }
    if(inputs.Hide_Card_Info != false && inputs.Hide_Card_Info != true) {
        validationErrors.push("Hide card info is not valid");
    }
    if(inputs.Allow_Fakes != false && inputs.Allow_Fakes != true) {
        validationErrors.push("Allow fakes is not valid");
    }

    if(inputs.Allow_Fakes === true) {
        if(inputs.Min_Fakes > 19 || inputs.Min_Fakes < 0) {
            validationErrors.push("Min fakes is not valid");
        }
        if(inputs.Max_Fakes > 19 || inputs.Max_Fakes < 0) {
            validationErrors.push("Max fakes is not valid");
        }
        if(inputs.Min_Fakes > inputs.Max_Fakes) {
            validationErrors.push("Min fakes is bigger than max fakes");
        }
    }

    if(inputs.Auto_Resets_Enabled != false && inputs.Auto_Resets_Enabled != 1) {
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

    if(inputs.Allow_Buyout != false || inputs.Allow_Buyout != true) {
        validationErrors.push("Allow buyout is not valid");
    }

    if(inputs.Start_Lock_Frozen != false || inputs.Start_Lock_Frozen != true) {
        validationErrors.push("Start lock frozen is not valid");
    }
    if(inputs.Disable_Keyholder_Decision != false || inputs.Disable_Keyholder_Decision != true) {
        validationErrors.push("Disable keyholder permission is not valid");
    }

    if(inputs.Limit_Users != false || inputs.Limit_Users != true) {
        validationErrors.push("Limit users is not valid");
    }

    if(inputs.Limit_Users === true) {
        if(inputs.User_Limit_Amount > 100 || inputs.User_Limit_Amount < 1) {
            validationErrors.push("Limit users amount is not valid");
        }
    }

    if(inputs.Block_Test_Locks != false || inputs.Block_Test_Locks != true) {
        validationErrors.push("Block test users is not valid");
    }

    if(inputs.Block_User_Rating_Enabled != false || inputs.Block_User_Rating_Enabled != true) {
        validationErrors.push("Block user rating enabled is not valid");
    }

    if(inputs.Block_User_Rating_Enabled === true) {
        if(inputs.Block_User_Rating > 5 || inputs.Block_User_Rating < 1) {
            validationErrors.push("User blocked rating is not valid");
        }
    }

    if(inputs.Block_Already_Locked != false || inputs.Block_Already_Locked != true) {
        validationErrors.push("Block already locked users is not valid");
    }

    if(inputs.Block_Stats_Hidden != false || inputs.Block_Stats_Hidden != true) {
        validationErrors.push("Block stat hidden users is not valid");
    }

    if(inputs.Only_Accept_Trusted != false || inputs.Only_Accept_Trusted != true) {
        validationErrors.push("Only accept trusted users is not valid");
    }

    if(inputs.Require_DM != false || inputs.Require_DM != true) {
        validationErrors.push("Require DM is not valid");
    }

    if(validationErrors.length) {
        throw new UserInputError("Form inputs are invalid!", {
          invalidArgs: validationErrors
        });
    }

    const CardsRecord = await models.OriginalLockType.create({
        Variable_Max_Greens: inputs.Variable_Max_Greens,
        Variable_Max_Reds: inputs.Variable_Max_Reds,
        Variable_Max_Freezes: inputs.Variable_Max_Freezes,
        Variable_Max_Doubles: inputs.Variable_Max_Doubles,
        Variable_Max_Stickies: inputs.Variable_Max_Stickies,
        Variable_Max_AddRed: inputs.Variable_Max_AddRed,
        Variable_Max_RemoveRed: inputs.Variable_Max_RemoveRed,
        Variable_Max_RandomRed: inputs.Variable_Max_RandomRed,
        Variable_Min_Greens: inputs.Variable_Min_Greens,
        Variable_Min_Reds: inputs.Variable_Min_Reds,
        Variable_Min_Freezes: inputs.Variable_Min_Freezes,
        Variable_Min_Doubles: inputs.Variable_Min_Doubles,
        Variable_Min_Stickies: inputs.Variable_Min_Stickies,
        Variable_Min_AddRed: inputs.Variable_Min_AddRed,
        Variable_Min_RemoveRed: inputs.Variable_Min_RemoveRed,
        Variable_Min_RandomRed: inputs.Variable_Min_RandomRed,
        Chance_Period: inputs.Chance_Period,
        Cumaltive: inputs.Cumaltive,
        Multiple_Greens_Required: inputs.Multiple_Greens_Required,
        Hide_Card_Info: inputs.Hide_Card_Info,
        Allow_Fakes: inputs.Allow_Fakes,
        Min_Fakes: inputs.Min_Fakes,
        Max_Fakes: inputs.Max_Fakes,
        Auto_Resets_Enabled: inputs.Auto_Resets_Enabled,
        Reset_Frequency: inputs.Reset_Frequency,
        Max_Resets: inputs.Max_Resets,
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
    const cardRecordID = CardsRecord.Original_Deck_ID;

    return models.CreatedLock.create({
        User_ID: req.Authenticated,
        Shared: inputs.Shared,
        Shared_Code: srs({length: 20, alphanumeric: true}),
        OriginalLockType_ID: cardRecordID,
        LockName: inputs.LockName,
        Disabled: 0
    });
}
module.exports = createOriginalLock;
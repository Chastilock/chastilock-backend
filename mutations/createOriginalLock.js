const { AuthenticationError, UserInputError } = require('apollo-server-express');

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
    if(inputs.Cumaltive != 0 && inputs.Cumaltive != 1) {
        validationErrors.push("Cumalative is not valid");
    }
    if(inputs.Multiple_Greens_Required != 0 && inputs.Multiple_Greens_Required != 1) {
        validationErrors.push("Multiple greens required is not valid");
    }
    if(inputs.Hide_Card_Info != 0 && inputs.Hide_Card_Info != 1) {
        validationErrors.push("Hide card info is not valid");
    }
    if(inputs.Allow_Fakes != 0 && inputs.Allow_Fakes != 1) {
        validationErrors.push("Allow fakes is not valid");
    }

    if(inputs.Allow_Fakes === 1) {
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

    if(inputs.Auto_Resets_Enabled != 0 && inputs.Auto_Resets_Enabled != 1) {
        validationErrors.push("Auto resets enabled is not valid");
    }
    
    if(inputs.Auto_Resets_Enabled === 1) {
        if (inputs.Reset_Frequency < 2 || inputs.Reset_Frequency > 399) {
            validationErrors.push("Reset frequency is not valid");
        }
        if (inputs.Max_Resets < 1 || inputs.Max_Resets > 20) {
            validationErrors.push("Max resets is not valid");
        }
    }

    if(inputs.Checkins_Enabled != 0 && inputs.Checkins_Enabled != 1) {
        validationErrors.push("Checkins enabled is not valid");
    }

    if(inputs.Checkins_Enabled === 1) {
        
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
        Hide_Card_Info: inputs.Hide_Card_Info
    });
    const cardRecordID = CardsRecord.Original_Deck_ID;

    return models.CreatedLock.create({
        User_ID: req.Authenticated,
        OriginalLockType_ID: cardRecordID,
        LockName: inputs.LockName,
        Disabled: 0
    });
}
module.exports = createOriginalLock;
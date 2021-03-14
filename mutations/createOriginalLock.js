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
        validationErrors.push("Name too long!");
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
        Variable_Min_RandomRed: inputs.Variable_Min_RandomRed
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
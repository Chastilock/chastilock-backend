const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server-express');
const srs = require('secure-random-string');
const { MAX_CARDS } = require('../helpers/max_cards')
const { validateCommonInputs } = require('../helpers/validatelockcreation')

async function createOriginalLock(inputs, models, req) {

    const CreateLockEnabled = await models.AppSetting.findOne({
        where: {
            Setting_Name: "Allow_CreateLock",
            Setting_Value: "true"
        }
    });
    if ( !CreateLockEnabled) {
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

    // at least one Green always required in a lock
    if(inputs.Variable_Max_Greens > MAX_CARDS.GREEN || inputs.Variable_Min_Greens < 1) {
        validationErrors.push("Invalid green card count")
    }
    if(inputs.Variable_Min_Greens > inputs.Variable_Max_Greens) {
        validationErrors.push("Min greens is bigger than max greens")
    }
    if(inputs.Variable_Max_Reds > MAX_CARDS.RED || inputs.Variable_Min_Reds < 0) {
        validationErrors.push("Invalid red card count")
    }
    if(inputs.Variable_Min_Reds > inputs.Variable_Max_Reds) {
        validationErrors.push("Min reds is bigger than max reds")
    }
    if(inputs.Variable_Max_Freezes > MAX_CARDS.FREEZE || inputs.Variable_Min_Freezes < 0) {
        validationErrors.push("Invalid freeze card count")
    }
    if(inputs.Variable_Min_Freezes > inputs.Variable_Max_Freezes) {
        validationErrors.push("Min freezes is bigger than max freezes")
    }
    if(inputs.Variable_Max_Doubles > MAX_CARDS.DOUBLE || inputs.Variable_Min_Doubles < 0) {
        validationErrors.push("Invalid double card count")
    }
    if(inputs.Variable_Min_Doubles > inputs.Variable_Max_Doubles) {
        validationErrors.push("Min doubles is bigger than max doubles")
    }
    if(inputs.Variable_Max_Resets > MAX_CARDS.RESET || inputs.Variable_Min_Resets < 0) {
        validationErrors.push("Invalid reset card count")
    }
    if(inputs.Variable_Min_Resets > inputs.Variable_Max_Resets) {
        validationErrors.push("Min resets is bigger than max resets")
    }
    if(inputs.Variable_Max_Stickies > MAX_CARDS.STICKY || inputs.Variable_Min_Stickies < 0) {
        validationErrors.push("Invalid Sticky card count")
    }
    if(inputs.Variable_Min_Stickies > inputs.Variable_Max_Stickies) {
        validationErrors.push("Min stickies is bigger than max stickies")
    }
    if(inputs.Variable_Max_AddRed > MAX_CARDS.YELLOW_ADD_RED || inputs.Variable_Min_AddRed < 0) {
        validationErrors.push("Invalid Yellow add card count")
    }
    if(inputs.Variable_Min_AddRed > inputs.Variable_Max_AddRed) {
        validationErrors.push("Min add red is bigger than max add red")
    }
    if(inputs.Variable_Max_RemoveRed > MAX_CARDS.YELLOW_REMOVE_RED || inputs.Variable_Min_RemoveRed < 0) {
        validationErrors.push("Invalid Yellow remove card count")
    }
    if(inputs.Variable_Min_RemoveRed > inputs.Variable_Max_RemoveRed) {
        validationErrors.push("Min remove red is bigger than max remove red")
    }
    if(inputs.Variable_Max_RandomRed > MAX_CARDS.YELLOW_RANDOM_RED || inputs.Variable_Min_RandomRed < 0) {
        validationErrors.push("Invalid Yellow random card count")
    }
    if(inputs.Variable_Min_RandomRed > inputs.Variable_Max_RandomRed) {
        validationErrors.push("Min random red is bigger than max random red")
    }

    if(inputs.Chance_Period > 1440 || inputs.Chance_Period < 1) {
        validationErrors.push("Chance period is not valid");
    }
    if(inputs.Cumulative != false && inputs.Cumulative != true) {
        validationErrors.push("Cumulative is not valid");
    }
    if(inputs.Multiple_Greens_Required != false && inputs.Multiple_Greens_Required != true) {
        validationErrors.push("Multiple greens required is not valid");
    }
    if(inputs.Hide_Card_Info != false && inputs.Hide_Card_Info != true) {
        validationErrors.push("Hide card info is not valid");
    }

    if(inputs.Auto_Resets_Enabled != false && inputs.Auto_Resets_Enabled != true) {
        validationErrors.push("Auto resets enabled is not valid");
    }
    
    if(inputs.Auto_Resets_Enabled === true) {
        if (inputs.Reset_Frequency === undefined || inputs.Max_Resets === undefined)
        {
            validationErrors.push('Frequency and number must be provided if auto resets enabled')
        }
        if (inputs.Reset_Frequency < 2 || inputs.Reset_Frequency > 399) {  // 399 what? minutes, hours, intervals?
            validationErrors.push("Reset frequency is not valid");
        }
        if (inputs.Max_Resets < 1 || inputs.Max_Resets > 20) {
            validationErrors.push("Max resets is not valid");
        }
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
        Variable_Max_Resets: inputs.Variable_Max_Resets,
        Variable_Max_Stickies: inputs.Variable_Max_Stickies,
        Variable_Max_AddRed: inputs.Variable_Max_AddRed,
        Variable_Max_RemoveRed: inputs.Variable_Max_RemoveRed,
        Variable_Max_RandomRed: inputs.Variable_Max_RandomRed,
        Variable_Min_Greens: inputs.Variable_Min_Greens,
        Variable_Min_Reds: inputs.Variable_Min_Reds,
        Variable_Min_Freezes: inputs.Variable_Min_Freezes,
        Variable_Min_Doubles: inputs.Variable_Min_Doubles,
        Variable_Min_Resets: inputs.Variable_Min_Resets,
        Variable_Min_Stickies: inputs.Variable_Min_Stickies,
        Variable_Min_AddRed: inputs.Variable_Min_AddRed,
        Variable_Min_RemoveRed: inputs.Variable_Min_RemoveRed,
        Variable_Min_RandomRed: inputs.Variable_Min_RandomRed,
        Chance_Period: inputs.Chance_Period,
        Cumulative: inputs.Cumulative,
        Multiple_Greens_Required: inputs.Multiple_Greens_Required,
        Hide_Card_Info: inputs.Hide_Card_Info,
        Auto_Resets_Enabled: inputs.Auto_Resets_Enabled,
        Reset_Frequency: inputs.Reset_Frequency,
        Max_Resets: inputs.Max_Resets,
    });
    const cardRecordID = CardsRecord.Original_Deck_ID;

    return models.CreatedLock.create({
        User_ID: req.Authenticated,
        Shared: inputs.Shared,
        Shared_Code: srs({length: 20, alphanumeric: true}),
        OriginalLockType_ID: cardRecordID,
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
module.exports = createOriginalLock;

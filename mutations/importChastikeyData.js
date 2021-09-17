const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const srs = require('secure-random-string');
const { Op } = require("sequelize");

async function importChastikeyData(inputs, models, req) {
    
    if (req.AppFound === false) {
        throw new AuthenticationError("App does not exist");
    }

    if (req.Authenticated === false) {
        throw new AuthenticationError("Session is not valid");
    }

    const ImportRecord = await models.ChastikeyImport.findOne({
        where: {
            [Op.and]: [
                {
                    User_ID: {
                        [Op.eq]: req.Authenticated
                    }
                },
                {
                    Complete: {
                        [Op.eq]: null
                    }
                    
                }
            ]
        }
    });

    if(ImportRecord === null) {
        throw new ForbiddenError("You need to first run the FetchChastikeyData mutation first!");
    }

    if(new Date().getTime() > new Date(ImportRecord.Expires).getTime()) {
        ImportRecord.destroy();
        throw new ForbiddenError("Data to import has expired. Please restart the process");
    }

    const DataToImport = JSON.parse(ImportRecord.Data);

    if(inputs.KeyholderImportActiveLocks) {
        for (let index = 0; index < DataToImport.keyholderLocks.length; index++) {
            const i = DataToImport.keyholderLocks[index];
           
            if(i.fixed === 0) {
            
                let AutoResetsEnabled = null;
                let AutoResetFrequency = null;

                if(i.autoResetFrequencyInSeconds === 0) {
                    AutoResetsEnabled = false;
                    AutoResetFrequency = null;
                } else {
                    AutoResetsEnabled = true;
                    AutoResetFrequency = i.autoResetFrequencyInSeconds / 60
                }

                const CardsRecord = await models.OriginalLockType.create({
                    Variable_Max_Greens: i.maxGreens,
                    Variable_Max_Reds: i.maxReds,
                    Variable_Max_Freezes: i.maxFreezes,
                    Variable_Max_Doubles: i.maxDoubleUps,
                    Variable_Max_Resets: i.maxResets,
                    Variable_Max_Stickies: i.maxStickies,
                    Variable_Max_AddRed: i.maxYellowsAdd,
                    Variable_Max_RemoveRed: i.maxYellowsMinus,
                    Variable_Max_RandomRed: i.maxYellows,
                    Variable_Min_Greens: i.minGreens,
                    Variable_Min_Reds: i.minReds,
                    Variable_Min_Freezes: i.minFreezes,
                    Variable_Min_Doubles: i.minDoubleUps,
                    Variable_Min_Resets: i.minResets,
                    Variable_Min_Stickies: i.minStickies,
                    Variable_Min_AddRed: i.minYellowsAdd,
                    Variable_Min_RemoveRed: i.minYellowsMinus,
                    Variable_Min_RandomRed: i.minYellows,
                    Chance_Period: i.regularity * 60,
                    Cumulative: i.cumulative,
                    Multiple_Greens_Required: i.multipleGreensRequired,
                    Hide_Card_Info: i.cardInfoHidden,
                    Auto_Resets_Enabled: AutoResetsEnabled,
                    Reset_Frequency: AutoResetFrequency,
                    Max_Resets: i.maxAutoResets,
                    Imported_From_CK: true 
                });
                
                const cardRecordID = CardsRecord.Original_Deck_ID;

                let AllowFakes = null;
                if(i.minFakes === 0 && i.maxFakes === 0) {
                    AllowFakes = false;
                } else {
                    AllowFakes = true;
                }

                let CheckinsEnabled = null;
                if(i.checkInFrequencyInSeconds === 0) {
                    CheckinsEnabled = false;
                } else {
                    CheckinsEnabled = true;
                }

                let AllowBuyout = null;
                if(i.emergencyReleaseDisabled === 1) {
                    AllowBuyout = false;
                } else {
                    AllowBuyout = true;
                }

                let LimitUsers = null;
                if(i.maxUsers === 0) {
                    LimitUsers = false;
                } else {
                    LimitUsers = true;
                }

                let BlockUserRating = null;
                if(i.minRatingRequired === 0) {
                    BlockUserRating = false;
                } else {
                    BlockUserRating = true;
                }
                
                models.CreatedLock.create({
                    User_ID: req.Authenticated,
                    Shared: 1,
                    Shared_Code: srs({length: 20, alphanumeric: true}),
                    OriginalLockType_ID: cardRecordID,
                    Lock_Name: i.lockName, 
                    Disabled: i.temporarilyDisabled,
                    Allow_Fakes: AllowFakes,
                    Min_Fakes: i.minFakes,
                    Max_Fakes: i.maxFakes,
                    Checkins_Enabled: CheckinsEnabled,
                    Checkins_Frequency: i.checkInFrequencyInSeconds / 60,
                    Checkins_Window: i.lateCheckInWindowInSeconds / 60,
                    Allow_Buyout: AllowBuyout,
                    Start_Lock_Frozen: i.startLockFrozen,
                    Disable_Keyholder_Decision: i.keyholderDecisionDisabled,
                    Limit_Users: LimitUsers,
                    User_Limit_Amount: i.maxUsers,
                    Block_Test_Locks: i.blockTestLocks,
                    Block_User_Rating_Enabled: BlockUserRating,
                    Block_User_Rating: i.minRatingRequired,
                    Block_Already_Locked: i.blockUsersAlreadyLocked,
                    Block_Stats_Hidden: i.blockUsersWithStatsHidden,
                    Only_Accept_Trusted: i.forceTrust,
                    Require_DM: i.requireContactFirst,
                    Imported_From_CK: true,
                    CK_ShareID: i.shareID
                })
            } else {
                
                const MaxDays = Math.floor(i.maxMinutes / (60 * 24));
                const MaxDaysRemainder = i.maxMinutes % (60 * 24);
                const MaxHours = MaxDaysRemainder / 60;
                const MaxMinutes = MaxDaysRemainder % 60;

                const MinDays = Math.floor(i.minMinutes / (60 * 24));
                const MinDaysRemainder = i.minMinutes % (60 * 24);
                const MinHours = MinDaysRemainder / 60;
                const MinMinutes = MinDaysRemainder % 60;
                
                //Timed KH Locks to import
                const TimerRecord = await models.TimerLockType.create({
                    Max_Days: MaxDays,
                    Max_Hours: MaxHours,
                    Max_Minutes: MaxMinutes,
                    Min_Days: MinDays,
                    Min_Hours: MinHours,
                    Min_Minutes: MinMinutes,
                    Hide_Timer: i.timerHidden,
                    Imported_From_CK: true
                })
            
                const TimerRecordID = TimerRecord.Timer_Type_ID;

                let AllowFakes = null;
                if(i.minFakes === 0 && i.maxFakes === 0) {
                    AllowFakes = false;
                } else {
                    AllowFakes = true;
                }

                let CheckinsEnabled = null;
                if(i.checkInFrequencyInSeconds === 0) {
                    CheckinsEnabled = false;
                } else {
                    CheckinsEnabled = true;
                }

                let AllowBuyout = null;
                if(i.emergencyReleaseDisabled === 1) {
                    AllowBuyout = false;
                } else {
                    AllowBuyout = true;
                }

                let LimitUsers = null;
                if(i.maxUsers === 0) {
                    LimitUsers = false;
                } else {
                    LimitUsers = true;
                }

                let BlockUserRating = null;
                if(i.minRatingRequired === 0) {
                    BlockUserRating = false;
                } else {
                    BlockUserRating = true;
                }
            
                models.CreatedLock.create({
                    User_ID: req.Authenticated,
                    Shared: 1,
                    Shared_Code: srs({length: 20, alphanumeric: true}),
                    TimerLockType_ID: TimerRecordID,
                    Lock_Name: i.lockName, 
                    Disabled: i.temporarilyDisabled,
                    Allow_Fakes: AllowFakes,
                    Min_Fakes: i.minFakes,
                    Max_Fakes: i.maxFakes,
                    Checkins_Enabled: CheckinsEnabled,
                    Checkins_Frequency: i.checkInFrequencyInSeconds / 60,
                    Checkins_Window: i.lateCheckInWindowInSeconds / 60,
                    Allow_Buyout: AllowBuyout,
                    Start_Lock_Frozen: i.startLockFrozen,
                    Disable_Keyholder_Decision: i.keyholderDecisionDisabled,
                    Limit_Users: LimitUsers,
                    User_Limit_Amount: i.maxUsers,
                    Block_Test_Locks: i.blockTestLocks,
                    Block_User_Rating_Enabled: BlockUserRating,
                    Block_User_Rating: i.minRatingRequired,
                    Block_Already_Locked: i.blockUsersAlreadyLocked,
                    Block_Stats_Hidden: i.blockUsersWithStatsHidden,
                    Only_Accept_Trusted: i.forceTrust,
                    Require_DM: i.requireContactFirst,
                    Imported_From_CK: true,
                    CK_ShareID: i.shareID
                });
                
            }
        };
    }

    ImportRecord.set({
        Complete: new Date,
        Data: null
    });
    ImportRecord.save();

    return ImportRecord;

}
module.exports = importChastikeyData;
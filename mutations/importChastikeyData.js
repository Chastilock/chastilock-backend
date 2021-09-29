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

    if(inputs.LockeeImportActiveLocks) {
        
        for (let index = 0; index < DataToImport.lockeeLocks.length; index++) {

            console.log("Importing Lockee lock")
          
            const i = DataToImport.lockeeLocks[index];

            let KeyholderFoundBool = false;
            
            if(i.keyholderID != 0) {
                KeyholderFound = await models.User.findOne({
                    where: {
                        CK_UserID: i.keyholderID
                    }
                });

                if(KeyholderFound === true) {
                    KeyholderFoundBool = true;
                }
            }

            if((i.keyholderID === 0) || (KeyholderFoundBool == true) || (KeyholderFoundBool === false && inputs.ImportLoadedLocksWithMissingKH === true)) {
                
                const CreatedLockRecord = await models.CreatedLock.findOne({
                    where: {
                        CK_ShareID: i.shareID
                    }
                })

                let CreatedLockID = null;

                if(CreatedLockRecord != null) {
                    CreatedLockID = CreatedLockRecord.Lock_ID
                }

                let Keyholder = null;
                if(i.keyholderID != 0) {
                    const KeyholderSearch = await models.User.findOne({
                        where: {
                            CK_UserID: i.keyholderID
                        }
                    })

                    if(KeyholderSearch) {
                        Keyholder = KeyholderSearch.User_ID
                    }

                }

                const Emergency_Keys_Enabled = !i.keysDisabled

                const FreeUnlock = false
                if(i.botChosen) {
                    FreeUnlock = true
                }
                
                if(i.fixed === 1) {

                    const UnlockTime = new Date;
                    UnlockTime.addMinutes(i.minutes);

                    models.LoadedLock.create({
                        CreatedLock_ID: CreatedLockID,
                        Lockee: req.Authenticated,
                        Keyholder: Keyholder,
                        Code: i.combination,
                        Timed_Unlock_Time: UnlockTime,
                        Hide_Info: i.timerHidden,
                        Emergency_Keys_Enabled: Emergency_Keys_Enabled,
                        Emergency_Keys_Amount: 1,
                        Test_Lock: false,
                        Trusted: i.trustKeyholder,
                        Unlocked: false,
                        Free_Unlock: FreeUnlock,
                    });
                } else {
                    
                    const time = new Date().getTime() / 1000;
                    const TimeOfLastChance = new Date();
                    let ChancesLeft = 0;


                    const LatestTimestamp = Math.max(i.timestampLocked - Math.floor(3600 * i.regularity), i.timestampLastAutoReset, i.timestampLastFullReset, i.timestampLastPicked)

                    if (i.lockFrozenByCard == 1 || i.lockFrozenByKeyholder == 1) {
                        ChancesLeft = i.chancesAccumulatedBeforeFreeze;
                    } else {

                        if (i.regularity == 0.016667) { ChancesLeft = (time - LatestTimestamp) / 60; }
                        if (i.regularity == 0.25) { ChancesLeft = (time - LatestTimestamp) / 60 / 15; }
                        if (i.regularity == 0.5) { ChancesLeft = (time - LatestTimestamp) / 60 / 30; }
                        if (i.regularity == 1) { ChancesLeft = (time - LatestTimestamp) / 60 / 60; }
                        if (i.regularity == 3) { ChancesLeft = (time - LatestTimestamp) / 60 / 60 / 3; }
                        if (i.regularity == 6) { ChancesLeft = (time - LatestTimestamp) / 60 / 60 / 6; }
                        if (i.regularity == 12) { ChancesLeft = (time - LatestTimestamp) / 60 / 60 / 12; }
                        if (i.regularity == 24) { ChancesLeft = (time - LatestTimestamp) / 60 / 60 / 24; }
                        if (i.chancesAccumulatedBeforeFreeze > 0) {
                            ChancesLeft = i.noOfChancesAccumulated + i.chancesAccumulatedBeforeFreeze;
                        }

                        //Let's get the decimal so we can work out when the last chance would have been awarded
                        
                        console.log(`ChancesLeft: ${ChancesLeft}`)
                        const decimal = ChancesLeft - Math.floor(ChancesLeft);
                        //We now have any decimal so we can discard it
                        ChancesLeft = Math.floor(ChancesLeft);

                        const NumberOfMinutesSinceChance = i.regularity * decimal * 60;
                        TimeOfLastChance.setTime(TimeOfLastChance.getTime() - (NumberOfMinutesSinceChance * 60000));

                    }
                    if (i.noOfChancesAccumulated > 1 && i.cumulative == 0) { 
                        i.noOfChancesAccumulated = 1; 
                    }

                    const LoadedOriginal = await models.LoadedOriginalLock.create({
                        Remaining_Red: i.redCards,
                        Remaining_Green: i.greenCards,
                        Found_Green: i.greenCardsPickedSinceReset,
                        Multiple_Greens_Required: i.multipleGreensRequired,
                        Remaining_Sticky: i.stickyCards,
                        Remaining_Add1: i.yellowAdd1Cards,
                        Remaining_Add2: i.yellowAdd2Cards,
                        Remaining_Add3: i.yellowAdd3Cards,
                        Remaining_Remove1: i.yellowMinus1Cards,
                        Remaining_Remove2: i.yellowMinus2Cards,
                        Remaining_Freeze: i.freezeCards,
                        Remaining_Double: i.doubleUpCards,
                        Remaining_Reset: i.resetCards,
                        Remaining_GoAgain: i.goAgainCards,
                        Cumulative: i.cumulative,
                        Hide_Card_Info: i.cardInfoHidden,
                        Chance_Period: i.regularity * 60,
                        Chances_Remaining: ChancesLeft,
                        Chances_Last_Awarded: TimeOfLastChance,
                        Last_Drawn: new Date(i.timestampLastPicked * 1000),
                        Auto_Resets_Paused: i.autoResetsPaused,
                        Auto_Resets_Frequency: i.autoResetFrequencyInSeconds * 60,
                        Auto_Resets_Time_Left: i.maxAutoResets - i.noOfTimesAutoReset,
                        Last_Auto_Reset: new Date(i.timestampLastAutoReset * 1000)
                    });

                    models.LoadedLock.create({
                        CreatedLock_ID: CreatedLockID,
                        Lockee: req.Authenticated,
                        Keyholder: Keyholder || null,
                        Code: i.combination,
                        Original_Lock_Deck: LoadedOriginal.Original_Loaded_ID,
                        Hide_Info: i.cardInfoHidden,
                        Emergency_Keys_Enabled: Emergency_Keys_Enabled,
                        Emergency_Keys_Amount: 1,
                        Test_Lock: false,
                        Trusted: i.trustKeyholder,
                        Unlocked: false,
                        Free_Unlock: FreeUnlock,
                        Imported_From_CK: true,
                        CK_ShareID: i.shareID
                    });
                }
            }
        }
    }
    
    const UserRecord = await models.User.findOne({
        where: {
            User_ID: req.Authenticated
        }
    });

    if(inputs.LockeeImportRating) {

        UserRecord.set({
            CK_Lockee_Rating: DataToImport.lockeeData.averageLockeeRating,
            CK_Lockee_TotalRatings: DataToImport.lockeeData.noOfLockeeRatings
        });
        UserRecord.save();

    }

    if(inputs.KeyholderImportRating) {

        UserRecord.set({
            CK_KH_Rating: DataToImport.keyholderData.averageRating,
            CK_KH_TotalRatings: DataToImport.keyholderData.noOfKeyholderRatings
        });
        UserRecord.save(); 
    }

    if(inputs.LockeeImportStats || inputs.KeyholderImportStats) {
        let CKStatsRecord = await models.CKStat.findOne({
            where: {
                User_ID: req.Authenticated
            }
        });

        if(!CKStatsRecord) {
            CKStatsRecord = await models.CKStat.create({
                User_ID: req.Authenticated
            });
        }

        if(inputs.LockeeImportStats) {
            await CKStatsRecord.set({
                Lockee_Average_Time_Locked: DataToImport.lockeeData.averageTimeLockedInSeconds,
                Lockee_Cumulative_Time_Locked: DataToImport.lockeeData.cumulativeSecondsLocked,
                Lockee_Level: DataToImport.lockeeData.lockeeLevel,
                Lockee_Longest_Lock: DataToImport.lockeeData.longestCompletedLockInSeconds,
                Lockee_Completed_Locks: DataToImport.lockeeData.totalNoOfCompletedLocks,
            });
        }
        if(inputs.KeyholderImportStats) {
            await CKStatsRecord.set({
                Keyholder_Level: DataToImport.keyholderData.keyholderLevel,
                Keyholder_First_Time: new Date(DataToImport.keyholderData.timestampFirstKeyheld * 1000),
                Keyholder_Locks_Managed: DataToImport.keyholderData.totalLocksManaged
            });
        }

        await CKStatsRecord.save();
    }

    ImportRecord.set({
        Complete: new Date,
        Data: null
    });
    ImportRecord.save();


    UserRecord.set({
       Joined_CK_Timestamp: new Date(DataToImport.userData.timestampJoined * 1000),
       CK_Username: DataToImport.userData.username,
       CK_UserID: DataToImport.userData.id
    });
    UserRecord.save(); 

    return ImportRecord;

}
module.exports = importChastikeyData;
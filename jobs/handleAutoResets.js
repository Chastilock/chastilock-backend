const { LoadedLock, LoadedOriginalLock } = require("../models");
const { Op } = require("sequelize");
const { hardResetLock } = require("../helpers/lockModifyingFunctions");

const handleAutoResets = async function() {
    //This will include all locks (test and fakes) but not unlocked locks
    //TODO: For efficiency we should probably eventually change the search criteria here
    //      to only find those locks that have unpaused autoresets, since the DB can probably
    //      do that more efficiently than the apollo server.  This will also decrease memory usage.
    const CurrentlyRunningLocks = await LoadedLock.findAll({
        where: {
            [Op.and]: {
                Unlocked: {
                    [Op.eq]: false
                },
                Original_Lock_Deck: {
                    [Op.ne]: null
                }
            }
        }
    });
    //Loop through the locks
    for(const Lock of CurrentlyRunningLocks) {
        //Check if a autoreset should have happened and action it if it should have
        console.log(`Auto Reset Job: Working on LoadedLockID: ${Lock.LoadedLock_ID}`)
        if(Lock.Original_Lock_Deck === null) {
            console.log(`Auto Reset Job: Not a original lock type. Skiping....`)
        } else {
            console.log(`Auto Reset Job: This is an original lock type. Getting associated OriginalLock Record`);
            const LoadedOriginalLockRecord = await LoadedOriginalLock.findOne({
                where: {
                    Original_Loaded_ID: Lock.Original_Lock_Deck
                }
            });
            if(LoadedOriginalLockRecord) {
                console.log(`Auto Reset Job: Got associated OriginalLock Record`);
                if(LoadedOriginalLockRecord.Auto_Resets_Paused === false && LoadedOriginalLockRecord.Auto_Resets_Frequency != null) {
                    const LastReset = new Date(LoadedOriginalLockRecord.Last_Auto_Reset);
                    const Now = new Date();

                    const Diference = Now.getTime() - LastReset.getTime();

                    const DiferenceMins = Math.floor(Diference / 60000); // gives elapsed minutes since last reset
                    
                    if(DiferenceMins > LoadedOriginalLockRecord.Auto_Resets_Frequency) {
                        console.log(`Auto Reset Job: Auto Resetting...`);
                        hardResetLock(Lock)
                        const new_Reset_Time_Left = 
                                 LoadedOriginalLockRecord.Auto_Resets_Time_Left - LoadedOriginalLockRecord.Auto_Resets_Frequency
                        LoadedOriginalLockRecord.set({
                            Last_Auto_Reset: new Date(),
                            Auto_Resets_Time_Left: new_Reset_Time_Left

                        });
                        await LoadedOriginalLockRecord.save()
                    } else {
                        console.log(`Auto Reset Job: No need to reset... yet 👿`);
                    }

                } else {
                    console.log(`Auto Reset Job: No need to work out auto resets for this lock`);
                }
            }
        }
        
    }
}
module.exports = handleAutoResets;
handleAutoResets();
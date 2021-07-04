const { LoadedLock, LoadedOriginalLock } = require("../models");
const { Op } = require("sequelize")

const handleAutoResets = async function() {
    //This will include all locks (test and fakes) but not unlocked locks
    const CurrentlyRunningLocks = await LoadedLock.findAll({
        where: {
            Unlocked: false
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
                    const DiferenceMins = Math.round(((Diference % 86400000) % 3600000) / 60000);
                    
                    if(DiferenceMins > LoadedOriginalLockRecord.Auto_Resets_Frequency) {
                        console.log(`Auto Reset Job: Auto Resetting...`);
                        //KHReset
                        //TODO: Implement KH Resets
                        LoadedOriginalLockRecord.set({Last_Auto_Reset: new Date()});
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
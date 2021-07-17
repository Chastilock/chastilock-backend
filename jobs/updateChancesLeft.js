//Update chances left
const { LoadedLock, LoadedOriginalLock } = require("../models");
const { Op } = require("sequelize");

const updateChancesLeft = async function() {
    //This will include all locks (test and fakes) but not unlocked locks
    const CurrentlyRunningLocks = await LoadedLock.findAll({
        where: {
            Unlocked: false
        }
    });
    //Loop through the locks
    for(const Lock of CurrentlyRunningLocks) {
        console.log(`Calculate Chances: Working on LoadedLockID: ${Lock.LoadedLock_ID}`)
        if(Lock.Original_Lock_Deck === null) {
            console.log(`Calculate Chances: Not a original lock type. Skiping....`)
        } else {
            
            if(Lock.Cumulative) {
                console.log(`Calculate Chances: Cumulative chances. Working...`);

            } else {
                console.log(`Calculate Chances: Non-cumulative chances. Working...`);
                const LoadedOriginalRecord = await LoadedOriginalLock.findOne({
                    where: {
                        Original_Loaded_ID: Lock.Original_Lock_Deck
                    }
                });

                const LastDrawn = LoadedOriginalRecord.Last_Drawn;
                const LastDrawnAsDate = new Date(LastDrawn);

                const Now = new Date();
                const TimeSinceDraw = Now.getTime() - LastDrawnAsDate.getTime();
                const DiferenceMins = Math.floor(TimeSinceDraw / 60000);

                if(DiferenceMins >= Lock.Chance_Period) {

                    console.log(`Calculate Chances: It's been more than their chance period since they last drew a card...`);

                    if(LoadedOriginalRecord.Chances_Remaining != 1) {
                    console.log(`Calculate Chances: They don't already have a chance so lets give them one`);
                        LoadedOriginalRecord.set({
                            Chances_Remaining: 1,
                            Chances_Last_Awarded: new Date()
                        });
                        await LoadedOriginalRecord.save();
                    } else {
                        console.log(`Calculate Chances: They already have a chance so skipping...`);
                    }
                }
            }
        }
        console.log(`Calculate Chances: Finished working on LoadedLockID: ${Lock.LoadedLock_ID}`);
    }
}
module.exports = updateChancesLeft;
updateChancesLeft();
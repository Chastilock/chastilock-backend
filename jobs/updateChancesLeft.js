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

            } else {

                const LoadedOriginalRecord = await LoadedOriginalLock.findOne({
                    where: {
                        Original_Loaded_ID: Lock.Original_Lock_Deck
                    }
                });

                const LastDrawn = LoadedOriginalRecord.Last_Drawn;
                const LastDrawnAsDate = new Date(LastDrawn);

                const Now = new Date();
                const TimeSinceDraw = Now.getTime() - LastDrawnAsDate.getTime();
                const DiferenceMins = Math.round(((TimeSinceDraw % 86400000) % 3600000) / 60000);

                console.log(LoadedOriginalRecord)

                console.log(LastDrawn)
                
                console.log(`TimeSinceDraw: ${TimeSinceDraw}`)
                console.log(`Difference in mins: ${DiferenceMins}`)

                if(DiferenceMins >= Lock.Chance_Period) {
                    OriginalLock.set({
                        Chances_Remaining: 1,
                        Chances_Last_Awarded: new Date()
                    });
                    await OriginalLock.save();
                }
            }
        }
    }
}
module.exports = updateChancesLeft;
updateChancesLeft();
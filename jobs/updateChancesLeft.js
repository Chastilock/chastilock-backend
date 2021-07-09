//Update chances left
const { LoadedLock } = require("../models");
const { Op } = require("sequelize")

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
            const OriginalLock = await Lock.getLoadedOriginalLock();
            
            if(Lock.Cumulative) {

            } else {
                const LastDrawn = OriginalLock.Last_Drawn;
                const LastDrawnAsDate = new Date(LastDrawn);

                const Now = new Date();
                const TimeSinceDraw = Now.getTime() - LastDrawnAsDate.getTime();
                const DiferenceMins = Math.round(((TimeSinceDraw % 86400000) % 3600000) / 60000);


                if(DiferenceMins >= Lock.Chance_Period) {
                    OriginalLock.set({Chances_Remaining: 1});
                    await OriginalLock.save();
                }
            }
        }
    }
}
module.exports = updateChancesLeft;
updateChancesLeft();
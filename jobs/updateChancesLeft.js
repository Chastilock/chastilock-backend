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
        }
    }
}
module.exports = updateChancesLeft;
updateChancesLeft();
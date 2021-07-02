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
        
    }
}
module.exports = updateChancesLeft;
updateChancesLeft();
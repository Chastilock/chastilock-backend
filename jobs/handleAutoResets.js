const { LoadedLock } = require("../models");
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
        
    }
}
module.exports = handleAutoResets;
handleAutoResets();
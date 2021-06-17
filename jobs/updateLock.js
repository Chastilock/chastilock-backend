const { LoadedLock, Freeze } = require("../models");

const UpdateLock = async function() {
    //This will include all locks (test and fakes) but not unlocked locks
    const CurrentlyRunningLocks = await LoadedLock.findAll({
        where: {
            Unlocked: false
        }
    });
    //Loop through the locks
    CurrentlyRunningLocks.forEach(Lock => {
        console.log(`Updating LoadedLock: ${Lock.LoadedLock_ID}`);

        //Check if the lock is frozen and update the loaded lock table as such

        const CurrentDateAndTime = new Date();
        const Frozen = Lock.Current_Freeze_ID;

        if(Frozen != null) {
            const FreezeRecord = await Freeze.findOne({
                where: {
                    Freeze_ID: Frozen
                }
            });

            if (FreezeRecord === null) {
                //Need to remove the freeze ID from the LoadedLock table
            } else {
                //Check if the freeze has ended
                if(FreezeRecord.EndTime != null && FreezeRecord.EndTime < CurrentDateAndTime) {
                    //Need to remove the freeze ID from the LoadedLock table
                }
            }
        }

        //Check if a autoreset should have happened and action it if it should have

        //Update chances left

    });

}
module.exports = updateLock;
UpdateLock();
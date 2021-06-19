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

        const ThisLock = await LoadedLock.findOne({
            where: {
                LoadedLock_ID: Lock.LoadedLock_ID
            }
        });

        //Check if the lock is frozen and update the loaded lock table as such

        const CurrentDateAndTime = new Date();
        const Frozen = Lock.Current_Freeze_ID;

        if(Frozen != null) {
            console.log(`Lock ${Lock.LoadedLock_ID} is currently frozen. Checking...`)
            const FreezeRecord = await Freeze.findOne({
                where: {
                    Freeze_ID: Frozen
                }
            });
            if (FreezeRecord === null) {
                console.log(`Freeze doesn't exist. Fixing...`)
                ThisLock.set({Current_Freeze_ID: null})
            } else {
                //Check if the freeze has ended
                if(FreezeRecord.EndTime != null && FreezeRecord.EndTime < CurrentDateAndTime) {
                    console.log(`Freeze is scheduled to have ended already. Removing Freeze...`)
                    ThisLock.set({Current_Freeze_ID: null})
                }
            }
        } else {
            console.log(`Lock ${Lock.LoadedLock_ID} is not currently frozen, but should it be... 👿`);
               
        }

        //Check if a autoreset should have happened and action it if it should have

        //Update chances left

    });

}
module.exports = updateLock;
UpdateLock();
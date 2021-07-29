const { LoadedLock, Freeze } = require("../models");
const { Op } = require("sequelize")
const { updateLockAfterFreezeEnd } = require("../helpers/lockModifyingFunctions")

const handleFreeze = async function() {
    //This will include all locks (test and fakes) but not unlocked locks
    const CurrentlyRunningLocks = await LoadedLock.findAll({
        where: {
            Unlocked: false
        }
    });
    //Loop through the locks
    for(let i = 0; i < CurrentlyRunningLocks.length; i++){
        const Lock = CurrentlyRunningLocks[i];
        console.log(`Freeze Job: Updating LoadedLock: ${Lock.LoadedLock_ID}`);       

        //Check if the lock is frozen and update the loaded lock table as such

        const CurrentDateAndTime = new Date();
        const Frozen = Lock.Current_Freeze_ID;

        if(Frozen != null) {
            console.log(`Freeze Job: Lock ${Lock.LoadedLock_ID} is currently frozen. Checking...`)
            const FreezeRecord = await Freeze.findOne({
                where: {
                    Freeze_ID: Frozen
                }
            });
            if (FreezeRecord === null) {
                console.log(`Freeze doesn't exist. Fixing...`)
                Lock.set({Current_Freeze_ID: null})
            } else {
                //Check if the freeze has ended
                if(FreezeRecord.EndTime != null && FreezeRecord.EndTime < CurrentDateAndTime) {
                    console.log(`Freeze Job: Freeze is scheduled to have ended already. Removing Freeze...`)
                    // need code here to handle timed locks which need their end time adjusted beacuse of the freeze
                    // and to give card locks an additional chance
                    updateLockAfterFreezeEnd(Lock, FreezeRecord)
                    Lock.set({Current_Freeze_ID: null})
                }
            }
        }

            console.log(`Freeze Job: Lock ${Lock.LoadedLock_ID} is not currently frozen, but should it be... 👿`);

            const CurrentFreeze = await Freeze.findOne({
                where: {
                    [Op.and]: [
                        {
                            Started: {
                                [Op.lt]: CurrentDateAndTime
                            }
                        },
                        {
                            EndTime: {
                                [Op.gt]: CurrentDateAndTime
                            }
                        },
                        {
                            Lock_ID: {
                                [Op.eq]: Lock.LoadedLock_ID
                            }
                        }
                    ]
                }
            });
            if(CurrentFreeze) {
                Lock.set({Current_Freeze_ID: CurrentFreeze.Freeze_ID});
                console.log(`Freeze Job: Lock ${Lock.LoadedLock_ID} needs freezing 😁 so have done it!!`);
            }
            await Lock.save()
    };

}
module.exports = handleFreeze;
handleFreeze();
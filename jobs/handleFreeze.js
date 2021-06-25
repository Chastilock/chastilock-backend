const { LoadedLock, Freeze } = require("../models");
const { Op } = require("sequelize")

const handleFreeze = async function() {
    //This will include all locks (test and fakes) but not unlocked locks
    const CurrentlyRunningLocks = await LoadedLock.findAll({
        where: {
            Unlocked: false
        }
    });
    //Loop through the locks
    for(const Lock of CurrentlyRunningLocks) {
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
        }
            console.log(`Lock ${Lock.LoadedLock_ID} is not currently frozen, but should it be... 👿`);
            //TESTED THIS AND IT WORKS!!
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
                        }
                    ]
                }
            });
            if(CurrentFreeze) {
                ThisLock.set({Current_Freeze_ID: CurrentFreeze.Freeze_ID});
                console.log(`Lock ${Lock.LoadedLock_ID} needs freezing 😁 so have done it!!`);
            }
            
            await ThisLock.save()
    };

}
module.exports = handleFreeze;
handleFreeze();
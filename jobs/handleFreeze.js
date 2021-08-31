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
                await Lock.save()
            } else {
                //Check if the freeze has ended
                if(FreezeRecord.EndTime != null && FreezeRecord.EndTime < CurrentDateAndTime) {
                    console.log(`Freeze Job: Freeze is scheduled to have ended already. Removing Freeze...`)
                    updateLockAfterFreezeEnd(Lock, FreezeRecord)
                    Lock.set({Current_Freeze_ID: null})
                    await Lock.save()
                }
            }
        }

            console.log(`Freeze Job: Lock ${Lock.LoadedLock_ID} is not currently frozen, but should it be... 👿`);
            // find any KH freeze for this lock that should have started; 
            // TODO: I don't believe this will find a keyholder freeze that has null for the end time. Note also
            // that there may potentially be many overlapping KH freezes and this will only find one of them.  
            // If there are overlapping freezes, the result of the following code is indeterminate as to which one
            // of them it is working with.  It probably shouldn't make a difference?
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
                        },
                        {
                            Type: {
                                [Op.eq]: "KH"
                            }
                        }
                    ]
                }
            });
            if(CurrentFreeze) {
                // if the found freeze is already applied to the lock, no need to do anything, so
                // test for inequality.  Following code will run if Lock.Current_Freeze_ID is null or if
                // the ID's are different.
                if(CurrentFreeze.Freeze_ID !== Lock.Current_Freeze_ID)
                {
                    // if there's a previous freeze, end it and set its end time to be the start time of 
                    // the current freeze, so there's no overlap or gap to mess up freeze time stats.
                    if (Lock.Current_Freeze_ID)  // might be null, so test
                    {
                        const OldFreeze = await Freeze.findByPk(Lock.Current_Freeze_ID);
                        OldFreeze.EndTime = CurrentFreeze.StartTime;
                        OldFreeze.save();
                    }
                    // then add the new freeze & save it
                    Lock.set({Current_Freeze_ID: CurrentFreeze.Freeze_ID});
                    await Lock.save()
                    console.log(`Freeze Job: Lock ${Lock.LoadedLock_ID} needs freezing 😁 so have done it!!`);
                }
            }
            // await Lock.save()
            // moved save() to inside of those if's where appropriate
            // otherwise code would save every running lock every time the job runs with lots of DB churn?
    };
}
module.exports = handleFreeze;
handleFreeze();
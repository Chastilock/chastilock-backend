const { LoadedLock } = require('../models');
const { Op } = require("sequelize");
const { RandomInt } = require("../helpers/random")

const EvilEyeHandle = require('../bots/evileye');
const randomNumber = require('random-number-csprng');

const botAction = async function() {
    const BotKeyheldLocks = await LoadedLock.findAll({
        where: {
            [Op.and]: {
                Bot_KH: {
                    [Op.ne]: null
                },
                Unlocked: {
                    [Op.eq]: false
                }
            }
        }
    });
    
    for(let i = 0; i < BotKeyheldLocks.length; i++){

        const Lock = BotKeyheldLocks[i];

        console.log(`BotAction: Proccessing lock: ${Lock.LoadedLock_ID}`)
       
        const TimeNow = new Date();
        const Last_KH_Change = new Date(Lock.Last_KH_Change);

        const Difference = new Date(TimeNow.getTime() - Last_KH_Change.getTime());

        const MinsSinceLastUpdate = Math.round(Difference.getTime() / 60000)
        const Bot = await Lock.getBot();
        const MaxTimeBeforeUpdate = Bot.Max_Time_Before_Updates;

        const PercentageOfMaxGone = Math.floor((MinsSinceLastUpdate / MaxTimeBeforeUpdate) * 100);
        console.log(`BotAction: ${PercentageOfMaxGone}% of the max time between bots has gone`);

        if(PercentageOfMaxGone >= 100) {
            console.log(`BotAction: An update is guaranteed so processing it now...`);
            passToBotFile(Lock.LoadedLock_ID);
        } else {
            console.log(`BotAction: An update is not guaranteed so need to generate a semi random chance...`);
            const reversePercentage = 100 - PercentageOfMaxGone;
            const Randomness = await RandomInt(1, reversePercentage);
            console.log(`BotAction: Randomness is ${Randomness}`);

            if (Randomness === 1) {
                console.log(`BotAction: An update is needed :). Processing it now...`);
                passToBotFile(Lock.LoadedLock_ID)
            } else {
                console.log(`BotAction: An update is not needed. We can skip this lock for now`);
            }
        }
    }

}

const passToBotFile = function(LockID) {
    switch(LockID) {
        case 1:
          //Pass to EvilEyeHandle
            EvilEyeHandle(LockID);
            break;
        default:
            //We should log the error somewhere!!
            break;
   }
}
module.exports = botAction;

botAction();
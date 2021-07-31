const { LoadedLock } = require('../models');
const { Op } = require("sequelize");
const { RandomInt } = require("../helpers/random")

const EvilEyeHandle = require('../bots/evileye');

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
        const Bot = await Lock.getBot()
        const MaxTimeBeforeUpdate = Bot.Max_Time_Before_Updates;

        const PercentageOfMaxGone = Math.floor((MinsSinceLastUpdate / MaxTimeBeforeUpdate) * 100);
        
        if(PercentageOfMaxGone >= 100) {
            passToBotFile(Lock.LoadedLock_ID);
        }

         
    }

}

const passToBotFile = function(LockID) {
    switch(LockID) {
        case 1:
          //Pass to EvilEyeHandle
            EvilEyeHandle(LockID);
            break;
   }
}

switch(Lock.Bot_KH) {
    case 1:
      //Pass to EvilEyeHandle
        EvilEyeHandle();
        break;
     
}
module.exports = botAction;

botAction();
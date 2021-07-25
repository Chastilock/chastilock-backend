const { LoadedLock } = require('../models');
const { Op } = require("sequelize");

const EvilEyeHandle = require('../bots/evileye');

const botAction = async function() {
    const BotKeyheldLocks = await LoadedLock.findAll({
        where: {
            Bot_KH: {
                [Op.ne]: null
            }
        }
    });

    for(Lock in BotKeyheldLocks) {
       switch(Lock.Bot_KH) {
          case 1:
              //Pass to EvilEyeHandle
              EvilEyeHandle();
              break;
             
       } 
    }

}
module.exports = botAction;

botAction();
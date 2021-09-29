const { CreatedLock, LoadedLock } = require("../models");
const { Op } = require("sequelize")
console.log("linkLockeesToTransferedKH")

const linkLockeesToTransferedKH = async function() {
    const LocksToCheck = await LoadedLock.findAll({
        where: {
            [Op.and]: {
                CK_ShareID: {
                    [Op.ne]: null
                },
                Keyholder: {
                    [Op.eq]: null
                }
            }
        }
    });

    console.log(LocksToCheck);

    for (let index = 0; index < LocksToCheck.length; index++) {
        const i = LocksToCheck[index];
        console.log(`linkLockeesToTransferedKH: ${i}`)

        const CreatedLockSearch = await CreatedLock.findOne({
            where: {
                CK_ShareID: i.CK_ShareID
            }
        });

        if(CreatedLockSearch) {
            const Keyholder = CreatedLockSearch.User_ID;
            const CreatedLockID = CreatedLockSearch.Lock_ID;
            
            const SingleLoadedLock = await LoadedLock.findOne({
                where: {
                    LoadedLock_ID: i.LoadedLock_ID
                }
            });

            SingleLoadedLock.set({
                CreatedLock_ID: CreatedLockID,
                Keyholder: Keyholder
            });
            await SingleLoadedLock.save();
        }
    }
}
module.exports = linkLockeesToTransferedKH
linkLockeesToTransferedKH();


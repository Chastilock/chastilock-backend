const { CreatedLock, LoadedLock } = require("../models");
const { Op } = require("sequelize")
const { addMessagesForSingleUser, sendMessages } = require('../helpers/notifications');
const { GetUsername } = require("../helpers/user");

const linkLockeesToTransferedKH = async function() {
    const LocksToCheck = await LoadedLock.findAll({
        where: {
            [Op.and]: {
                CK_ShareID: {
                    [Op.ne]: null
                },
                Keyholder: {
                    [Op.eq]: null
                },
                Imported_From_CK: {
                    [Op.eq]: true
                }
            }
        }
    });

    const NotiMessages = [];

    for (let index = 0; index < LocksToCheck.length; index++) {
        const i = LocksToCheck[index];

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

            NotiMessages = await addMessagesForSingleUser(Keyholder, NotiMessages, `Your lockee ${GetUsername(i.Lockee)} has transfered a running lock to ChastiLock and it has been linked to you. You are back in control! 😈`, {view: "LoadedLockees", createdLock: i.CreatedLock_ID})
        }
    }
    
    if(NotiMessages.length > 0) {
        sendMessages(NotiMessages);
    }
}
module.exports = linkLockeesToTransferedKH
linkLockeesToTransferedKH();


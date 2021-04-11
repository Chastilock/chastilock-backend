const { OriginalLockType } = require("../models");

async function loadOriginalLockType(CreatedLock) {

    const Errors = [];

    const OriginalLockID = CreatedLock.OriginalLockType_ID;
    const LockDetails = await OriginalLockType.findByPk(OriginalLockID);

    if(!LockDetails) {
        console.log("Cannot find lock");
        Error.push("Cannot find lock");
    }
}
module.exports = loadOriginalLockType
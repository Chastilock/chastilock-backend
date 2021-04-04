const { OriginalLockType } = import("../models");
async function loadOriginalLockType(CreatedLock) {

    const OriginalLockID = CreatedLock.OriginalLockType_ID;
    const LockDetails = await OriginalLockType.findByPk(OriginalLockID);

    if(!LockDetails) {
        return "Cannot find lock";
    }
}
module.exports = loadOriginalLockType
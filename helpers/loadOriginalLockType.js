const { UserInputError } = require("apollo-server-errors");
const { OriginalLockType } = require("../models");
const { RandomInt, SplitNumberInto2Rand, SplitNumberInto3Rand } = require('./random');

async function loadOriginalLockType(CreatedLock) {

    const Errors = [];

    const OriginalLockID = CreatedLock.OriginalLockType_ID;
    const LockDetails = await OriginalLockType.findByPk(OriginalLockID);

    if(!LockDetails) {
        Errors.push("Cannot find lock");
    }

    const Reds = RandomInt(LockDetails.Variable_Min_Reds, LockDetails.Variable_Max_Reds);
    const Greens = RandomInt(LockDetails.Variable_Min_Greens, LockDetails.Variable_Min_Greens);
    const Stickies = RandomInt(LockDetails.Variable_Min_Stickies, LockDetails.Variable_Max_Stickies);
    const Resets = RandomInt(LockDetails.Variable_Min_Resets, LockDetails.Variable_Max_Resets);
    const Doubles = RandomInt(LockDetails.Variable_Min_Doubles, LockDetails.Variable_Max_Doubles);

    const TotalAddReds = RandomInt(LockDetails.Variable_Min_AddRed, LockDetails.Variable_Max_AddRed);
    const TotalRemoveReds = RandomInt(LockDetails.Variable_Min_RemoveRed, LockDetails.Variable_Max_RemoveRed);
    const TotalRandomReds = RandomInt(LockDetails.Variable_Min_RandomRed, LockDetails.Variable_Max_RandomRed);

    const RandomSplit = SplitNumberInto2Rand(TotalRandomReds);

    TotalAddReds =+ RandomSplit.Num1
    TotalRemoveReds =+ RandomSplit.Num2

    const AddRedSplit = SplitNumberInto3Rand(TotalAddReds);

    const Add1 = AddRedSplit.Num1
    const Add2 = AddRedSplit.Num2
    const Add3 = AddRedSplit.Num3

    const RemoveRedSplit = SplitNumberInto2Rand(TotalRemoveReds);

    const Remove1 = RemoveRedSplit.Num1
    const Remove2 = RemoveRedSplit.Num2

    




    if(Errors.length) {
      throw new UserInputError("Unable to load lock", {
        invalidArgs: Errors
      })
    } 
}
module.exports = loadOriginalLockType
const { UserInputError } = require("apollo-server-errors");
const { OriginalLockType, LoadedOriginalLock } = require("../models");
const { RandomInt, SplitNumberInto2Rand, SplitNumberInto3Rand, SplitNumberInto5Rand } = require('./random');

async function loadOriginalLockType(CreatedLock) {

    const Errors = [];

    const OriginalLockID = CreatedLock.OriginalLockType_ID;
    const LockDetails = await OriginalLockType.findByPk(OriginalLockID);

    const HideCardInfo = LockDetails.Hide_Card_Info;

    if(!LockDetails) {
        Errors.push("Cannot find lock");
    }

    const Reds = RandomInt(LockDetails.Variable_Min_Reds, LockDetails.Variable_Max_Reds);
    const Greens = RandomInt(LockDetails.Variable_Min_Greens, LockDetails.Variable_Min_Greens);
    const Stickies = RandomInt(LockDetails.Variable_Min_Stickies, LockDetails.Variable_Max_Stickies);
    const Resets = RandomInt(LockDetails.Variable_Min_Resets, LockDetails.Variable_Max_Resets);
    const Doubles = RandomInt(LockDetails.Variable_Min_Doubles, LockDetails.Variable_Max_Doubles);
    const Freezes = RandomInt(LockDetails.Variable_Min_Freezes, LockDetails.Variable_Max_Freezes);

    let TotalAddReds = RandomInt(LockDetails.Variable_Min_AddRed, LockDetails.Variable_Max_AddRed);
    let TotalRemoveReds = RandomInt(LockDetails.Variable_Min_RemoveRed, LockDetails.Variable_Max_RemoveRed);
    let TotalRandomReds = RandomInt(LockDetails.Variable_Min_RandomRed, LockDetails.Variable_Max_RandomRed);

    const RandomSplit = SplitNumberInto2Rand(TotalRandomReds);

    TotalAddReds =+ RandomSplit.Num1
    TotalRemoveReds =+ RandomSplit.Num2

    const AddRedSplit = SplitNumberInto3Rand(TotalAddReds);

    let Add1 = AddRedSplit.Num1
    let Add2 = AddRedSplit.Num2
    let Add3 = AddRedSplit.Num3

    const RemoveRedSplit = SplitNumberInto2Rand(TotalRemoveReds);

    let Remove1 = RemoveRedSplit.Num1
    let Remove2 = RemoveRedSplit.Num2

    const SplitRandom = SplitNumberInto5Rand(TotalRandomReds);

    Add1 = Add1 + SplitRandom.Num1
    Add2 = Add2 + SplitRandom.Num2
    Add3 = Add3 + SplitRandom.Num3
    Remove1 = Remove1 + SplitRandom.Num4
    Remove2 = Remove2 + SplitRandom.Num5

    let GoAgainCards = 0;

    if(HideCardInfo) {
      const TotalCards = Reds + Greens + Stickies + Resets + Doubles + Freezes + TotalAddReds + TotalRandomReds + TotalRemoveReds;
      const RandomPercentage = RandomInt(0, 15);
      GoAgainCards = (RandomPercentage / 100) * TotalCards;
    }

    if(Errors.length) {
      throw new UserInputError("Unable to load lock", {
        invalidArgs: Errors
      })
    }
    
    const OriginalLockRecord = await LoadedOriginalLock.create({
      Remaining_Red: Reds,
      Remaining_Green: Greens,
      Found_Green: 0,
      Remaining_Sticky: Stickies,
      Remaining_Add1: Add1,
      Remaining_Add2: Add2,
      Remaining_Add3: Add3,
      Remaining_Remove1: Remove1,
      Remaining_Remove2: Remove2,
      Remaining_Freeze: Freezes,
      Remaining_Double: Doubles,
      Remaining_Reset: Resets,
      Remaining_GoAgain: GoAgainCards,
      Cumulative: LockDetails.Cumulative,
      Hide_Card_Info: HideCardInfo,
      Chance_Period: LockDetails.Chance_Period
    })

    return OriginalLockRecord;
}
module.exports = loadOriginalLockType
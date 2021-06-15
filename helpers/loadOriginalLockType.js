const { UserInputError } = require("apollo-server-errors");
const { OriginalLockType, LoadedOriginalLock } = require("../models");
const { RandomInt, SplitNumberInto2Rand, split } = require('./random');

async function loadOriginalLockType(CreatedLock) {

    const Errors = [];

    const OriginalLockID = CreatedLock.OriginalLockType_ID;
    const LockDetails = await OriginalLockType.findByPk(OriginalLockID);

    const HideCardInfo = LockDetails.Hide_Card_Info;

    if(!LockDetails) {
        Errors.push("Cannot find lock");
    }

    const Reds = await RandomInt(LockDetails.Variable_Min_Reds, LockDetails.Variable_Max_Reds);
    const Greens = await RandomInt(LockDetails.Variable_Min_Greens, LockDetails.Variable_Max_Greens);
    const Stickies = await RandomInt(LockDetails.Variable_Min_Stickies, LockDetails.Variable_Max_Stickies);
    const Resets = await RandomInt(LockDetails.Variable_Min_Resets, LockDetails.Variable_Max_Resets);
    const Doubles = await RandomInt(LockDetails.Variable_Min_Doubles, LockDetails.Variable_Max_Doubles);
    const Freezes = await RandomInt(LockDetails.Variable_Min_Freezes, LockDetails.Variable_Max_Freezes);

    let TotalAddReds = await RandomInt(LockDetails.Variable_Min_AddRed, LockDetails.Variable_Max_AddRed);
    let TotalRemoveReds = await RandomInt(LockDetails.Variable_Min_RemoveRed, LockDetails.Variable_Max_RemoveRed);
    let TotalRandomReds = await RandomInt(LockDetails.Variable_Min_RandomRed, LockDetails.Variable_Max_RandomRed);

    const RandomSplit = await SplitNumberInto2Rand(TotalRandomReds);

    // ? was += intended instead of =+ ?
    //TotalAddReds =+ RandomSplit.Num1  // same as TotalAddReds = RandomSplit.Num1
    //TotalRemoveReds =+ RandomSplit.Num2

    //const AddRedSplit = await SplitNumberInto3Rand(TotalAddReds); // skewed 50%
    const AddRedSplit = split(TotalAddReds, 3)

    let Add1 = AddRedSplit[0]
    let Add2 = AddRedSplit[1]
    let Add3 = AddRedSplit[2]

    const RemoveRedSplit = await SplitNumberInto2Rand(TotalRemoveReds);

    let Remove1 = RemoveRedSplit.Num1
    let Remove2 = RemoveRedSplit.Num2

    // const SplitRandom = await SplitNumberInto5Rand(TotalRandomReds); //skewed 87.5% add, only 12.5 removes
    const SplitRandom = split(TotalRandomReds, 5)
    Add1 = Add1 + SplitRandom[0]
    Add2 = Add2 + SplitRandom[1]
    Add3 = Add3 + SplitRandom[2]
    Remove1 = Remove1 + SplitRandom[3]
    Remove2 = Remove2 + SplitRandom[4]

    let GoAgainCards = 0;

    if(HideCardInfo) {
      const TotalCards = Reds + Greens + Stickies + Resets + Doubles + Freezes + TotalAddReds + TotalRandomReds + TotalRemoveReds;
      const RandomPercentage = await RandomInt(0, 15);
      GoAgainCards = Math.floor((RandomPercentage / 100) * TotalCards); // must be whole number
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
      Multiple_Greens_Required: LockDetails.Multiple_Greens_Required,
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
      //Cumulative: LockDetails.Cumulative, //moved to LoadedLock
      //Hide_Card_Info: HideCardInfo,  //moved to LoadedLock
      //Chance_Period: LockDetails.Chance_Period //moved to LoadedLock
    })

    return OriginalLockRecord;
}
module.exports =  { loadOriginalLockType }

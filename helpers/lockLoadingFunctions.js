const { NewCode } = require('./code')
const { loadOriginalLockType } = require('./loadOriginalLockType');
const { calculateMinutes } = require('./timeFunctions')
const { RandomInt } = require('./random')
const { CreatedLock, OriginalLockType, TimerLockType, LoadedLock } = require("../models");

/**
 * Finds the TimerLockType object associated with a CreatedLock object and creates and returns an
 * object whose properties can be used in the creation of a LoadedLock object from the createdLock
 * object.  An Error is thrown if the CreatedLock object does not link to a TimerLockType object.
 *
 * @param {CreatedLock} createdLock - the CreatedLock object from which to create a loaded lock
 * @throws {Error} - if the createdLock object does not have an associated TimerLockType object
 * @returns { Object }
 */
async function findFixedProperties(createdLock) {
  if (!createdLock.TimerLockType_ID) {
      throw new Error("findFixedProperties called on a CreatedLock without a TimerLockType")
  }
  /** @type {TimerLockType} */
  timed = await TimerLockType.findByPk(createdLock.TimerLockType_ID);

  minTime = calculateMinutes(timed.Min_Days, timed.Min_Hours, timed.Min_Minutes)
  maxTime = calculateMinutes(timed.Max_Days, timed.Max_Hours, timed.Max_Minutes)
  lockLength = RandomInt(minTime, maxTime)
  params = {
    Hide_Info: timer.Hide_Timer,
    Timed_Unlock_Time: Date.now() + lockLength * 1000 // do I need Date.now().getTime() + or something similar
  }
  return params
}

/**
 * Finds the OriginalLockType object associated with a CreatedLock object and creates and returns
 * an object whose properties can be used to create a LoadedLock object from the createdLock
 * object.  An Error is thrown if the CreatedLock object does not link to an OriginalLockType object.
 *
 * @param {CreatedLock} createdLock - the CreatedLock object from which to create a loaded lock
 * @throws {Error} - if the createdLock object does not have an associated OriginalLockType object
 * @returns { Object }
 */
async function findVariableProperties(createdLock) {
  if (!createdLock.OriginalLockType_ID) {
      throw new Error("findVariableProperties called on a CreatedLock without a OriginalLockType");
  }
  /** @type {OriginalLockType} */
  lock = await OriginalLockType.findByPk(createdLock.OriginalLockType_ID)
  console.log(lock)
  /** @type {LoadedOriginalLock} */
  deck = await loadOriginalLockType(createdLock)
  console.log(deck)

  deck_ID = deck.Original_Loaded_ID  //Original_Loaded_ID
  console.log(deck_ID)
  params = {
    Deck_ID: deck_ID,
    Chance_Period: lock.Chance_Period,
    Cumulative: lock.Cumulative,
    Chances: 1,
    Last_Chance_Time: Date.now(),
    Hide_Info: lock.Hide_Card_Info,
    Start_Lock_Frozen: lock.Start_Lock_Frozen, // included for future use
    Auto_Resets_Enabled: lock.Auto_Resets_Enabled, // included for future use
    Reset_Frequency: lock.Reset_Frequency, // included for future use
    Max_Resets: lock.Max_Resets // included for future use
  }
  console.log(params)
  return params
}

/**
* Creates either a real or a fake LoadedLock for the user with User_ID based on a CreatedLock and inputs objects.
* If creating a real lock, is_real_lock should be true, and real_lock_link omitted or undefined.
* If creating a fake lock, is_real_lock should be fales, and real_lock_link should be the LoadedLock_ID of
* the corresponding real lock.
* @param {CreatedLock} createdLock - The CreatedLock from which to create the LoadedLock
* @param {int} User_ID - the User_ID of the User loading the lock
* @param {object} inputs - the input object associated with the loadLock mutation
* @param {boolean} is_real_lock - True if created lock should be real, false if should be fake
* @param {int?} real_lock_link - The LoadedLock_ID of the corresponding real LoadedLock or undefined 
* @returns {LoadedLock} - The LoadedLock object created
*/
async function createLoadedLock(createdLock, User_ID, inputs, is_real_lock, real_lock_link) {
  params = (createdLock.OriginalLockType_ID !== undefined) ? // true if variable, false if fixed
    await findVariableProperties(createdLock) :
    await findFixedProperties(createdLock)
  console.log(params);
  const loadedLock = await LoadedLock.create({
    CreatedLock_ID: createdLock.Lock_ID,
    Lockee: User_ID,
    Keyholder: createdLock.User_ID,
    Code: inputs.Code || await NewCode(User_ID),
    Original_Lock_Deck: params.Deck_ID,
    Timed_Unlock_Time: params.Timed_Unlock_Time,
    Hide_Info: params.Hide_Info,
    Emergency_Keys_Enabled: inputs.Emergency_Keys,
    Emergency_Keys_Amount: inputs.Emergency_Keys_Amount, // defaults to zero if undefined in input - OK?
    Test_Lock: inputs.Test_Lock,
    Cumulative: params.Cumulative,
    Chance_Period: params.Chance_Period,
    Chances: params.Chances,
    //Last_Pick_Time not initialized, so undefined until first pick
    Last_Chance_Time: params.Last_Chance_Time,
    // Current_Freeze_ID: not initialized, so starts as null.  TODO: Add code to support start frozen.
    // Lockee_Rating, KeyholderRating not initialized
    Unlocked: false,
    Free_Unlock: false,
    Fake_Lock: !is_real_lock,
    Real_Lock: real_lock_link
  })
  return loadedLock;
}

module.exports = { createLoadedLock }
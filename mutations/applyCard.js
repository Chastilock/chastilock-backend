const { AuthenticationError, ApolloError,  UserInputError } = require('apollo-server-express');
const { LoadedLock, Freeze } = require("../models");
const { applyCardToLockDeck } = require('../helpers/cardApplierFunctions');

//TODO: replace validation of chances (line 35) when chance structure finalized

async function applyCard(inputs, models, req) {

  if(req.AppFound === false) {
    throw new AuthenticationError("App does not exist");
  }
  if(req.Authenticated === false) {
    throw new AuthenticationError("Session is not valid");
  }

  /** @type { LoadedLock } */
  const lock = await LoadedLock.findByPk(inputs.LoadedLock_ID);

  if(!lock) {
    throw new ApolloError("Lock is not found", 404);
  }

  // make sure Lockee is the person drawing the card
  if(lock.Lockee != req.Authenticated) {
    throw new AuthenticationError("Access denied");
  }

  const validationErrors = [];

  // TODO: ??? To be determined - Do we need code to check for pending autoresets here ???

  // TODO: replace next 2 lines with appropriate code once chance code is written
  // commented out for now, so that applying cards can be run repeatedly during testing
  //if (lock.Chances < 1) {
  //  validationErrors.push("The lockee has no chances");
  //}

  // TODO: ?? Refactor to move the code to a helper function called ?isFrozen that will return boolean?
  // presumably the lockee wouldn't be drawing cards if frozen, but
  // it's possible a keyholder freeze may have just occurred
  let fr_ID = lock.Current_Freeze_ID;
  if (fr_ID !== null)  { // freeze exists
    const freeze = await Freeze.findByPk(fr_ID);
    if (!freeze) { // not found in Freezes table, so DB inconsistent
      // fix it?
      lock.CurrentFreeze = null;
      await lock.save();
    } else if (!freeze.EndTime || // keyholder frozen without end time
          (freeze.EndTime - Date.now() > 0)) { // freeze has not yet expired
        validationErrors.push("The lock is currently frozen");
    } else { // expired freeze
      // TODO: ??? fix expired freeze 
      // does code to delete an expired card freeze belong here
      // or in another mutation where the app updates to check the status of a lock
      // or in some server cron job, or all of the above...
    }
  }

  if(validationErrors.length) {
    throw new UserInputError("Cannot apply drawn card to lock", {
        invalidArgs: validationErrors
    });
  }

  await applyCardToLockDeck(inputs.Card, lock)

  return lock
}

module.exports = applyCard;

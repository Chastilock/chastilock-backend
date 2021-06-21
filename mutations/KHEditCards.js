const { AuthenticationError, ApolloError, UserInputError } = require('apollo-server-express');
const MAX_CARDS = require('../helpers/max_cards');
const { LoadedLock } = require('../models')

// TODO: If/when trust structure is changed, then the trust code below will need to be revised.
/*
KHEditCards(
  LoadedLock_ID: Int!, 
  Green: Int!, 
  Red: Int!,
  Sticky: Int!, 
  Yellow_Plus1: Int!, 
  Yellow_Plus2: Int!, 
  Yellow_Plus3: Int!, 
  Yellow_Minus1: Int!, 
  Yellow_Minus2: Int, 
  Freeze: Int!, Double: 
  Int!, Reset: Int!, 
  Go_Again: Int
  ) : LoadedLock!
*/
async function KHEditCards(inputs, models, req) {

  if (req.AppFound === false) {
    throw new AuthenticationError("App does not exist");
  }
  if (req.Authenticated === false) {
    throw new AuthenticationError("Session is not valid");
  }

  /** @type { LoadedLock } */
  const LockSearch = await models.LoadedLock.findByPk(inputs.LoadedLock_ID)

  if (!LockSearch) {
    throw new ApolloError("Lock is not found", 404);
  }

  if (LockSearch.Keyholder != req.Authenticated) {
    throw new AuthenticationError("Access denied");
  }

  validationErrors = []
  // TODO: Lots of validation including:
  //        check to make sure that LockSearch is a card lock
  //        check to make determine whether keyholder is trusted
  //        and the untrusted keyholder modification cooldown period has expired
  //                DB: probably needs to have a field for that eventually.  

  if (validationErrors.length) {
    throw new UserInputError("Cannot reset lock", {
      invalidArgs: validationErrors
    });
  }

  // code to retrieve the loadedOriginalLock
  /** @type { loadedOriginalLock } */
  cards = LoadedOriginalLock.findByPk(LockSearch.Original_Lock_Deck)
  if (!cards) {
    throw Error("DB Error - could not find LoadedOriginalLock")
  }

  // TODO:  if keyholder is not trusted, then check that untrusted keyholder restrictions are 
  //        being followed, whatever they end up being, and throw error if necessary.

  // TODO: Update fields in the loadedOriginalLock record and save


  return LockSearch
}

module.exports = KHEditCards;

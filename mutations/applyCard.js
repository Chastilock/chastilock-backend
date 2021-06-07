const { AuthenticationError, ApolloError,  UserInputError } = require('apollo-server-express');
const { default: CardApplierManager } = require('chastilock-cardgame/dist/cards/CardApplierManager');
const { Freeze } = require('./../models/Freeze')
const { LoadedLock } = require('./../models/LoadedLock')
const { LoadedOriginalLock } = require('./../models/LoadedOriginalLock')
import { CardType } from 'graphql'

async function applyCard(inputs, models, req) {

  if(req.AppFound === false) {
    throw new AuthenticationError("App does not exist");
  }
  if(req.Authenticated === false) {
    throw new AuthenticationError("Session is not valid");
  }

  //Find lock that where we are going to apply card
  const LockSearch = await models.LoadedLock.findOne({
      where: {
          LoadedLockID: inputs.LoadedLock_ID
      }
  });

  if(!LockSearch) {
    throw new ApolloError("Lock is not found", 404);
  }

  // make sure Lockee is the person drawing the card
  if(LockSearch.Lockee != req.Authenticated) {
    throw new AuthenticationError("Access denied");
  }

  const validationErrors = [];

  // do we need code to check for autoresets here

  // how will chances be incremented

  if (LockSearch.Chances < 1) {
    validationErrors.push("The lockee has no chances");
  }

  // presumably the lockee wouldn't be drawing cards if frozen, but
  // it's possible a keyholder freeze may have just occurred
  let fr_ID = LockSearch.Current_Freeze_ID;
  if (fr_ID !== null)  { // freeze exists
    const freeze = await models.Freeze.findByPK(fr_ID);
    if (freeze === null) { // not found in Freezes table, so DB inconsistent
      // fix it?
      LockSearch.CurrentFreeze = null;
      await LockSearch.save();
    } else if (freeze.EndTime - Date.now() > 0) { // freeze has not yet expired
      validationErrors.push("The lock is currently frozen");
    } else {
      ;
      // TODO: ??? expired freeze 
      // does code to delete an expired card freeze belong here
      // or in another mutation where the app updates to check the status of a lock
      // or in some server cron job, or...
    }
  }

  let deck_ID = LockSearch.Original_Lock_Deck;
  const Deck = await models.LoadedOriginalLock.findByPK(deck_ID)
  if (Deck === null) { // shouldn't be unless there's a DB issue
    validationErrors.push("There is no deck in the lock???")
  }

  if(validationErrors.length) {
    throw new UserInputError("Cannot apply card", {
        invalidArgs: validationErrors
      });
  }
  // if got here, deck should be available

  // ? this is probably be available already somewhere else ?
  // but if so, I couldn't find it
  MAX_CARDS = {
    GREEN = 100, /* Same as CK */
    RED = 599, /* Same as CK */
    STICKY = 100, /* Same as CK */
    YELLOW_PLUS1 = 299, /* Same as CK */
    YELLOW_PLUS2 = 299, /* Same as CK */
    YELLOW_PLUS3 = 299, /* Same as CK */
    YELLOW_MINUS1 = 299, /* Same as CK */
    YELLOW_MINUS2 = 299, /* Same as CK */
    FREEZE = 100, /* Same as CK */
    DOUBLE = 100, /* Same as CK */
    RESET = 100 /* Same as CK */
  }

  switch ( inputs.CARD ) {
    case CardType.GREEN:
      Deck.Remaining_Green--;
      if (Deck.Remaining_Green < 0) {
        validationErrors.push("Green drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      Deck.Found_Green++;
      await Deck.save();
      // TODO: ??? possibly need code here to check if lock finished???
      break;

    case CardType.RED:
      Deck.Remaining_Red--;
      if (Deck.Remaining_Red < 0) {
        validationErrors.push("Red drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      await Deck.save();
      LockSearch.Chances--;
      await LockSearch.save();
      break;

    case CardType.STICKY:
      if (Deck.Remaining_Sticky < 1) {
        validationErrors.push("Sticky drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      LockSearch.Chances--;
      await LockSearch.save();
      break;

    case CardType.YELLOW_PLUS1:
      Deck.Remaining_Add1--;
      if (Deck.Remaining_Add1 < 0) {
        validationErrors.push("Yellow Add 1 drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      Deck.Remaining_Red++;
      if(Deck.Remaining_Red > MAX_CARDS.RED){
        Deck.Remaining_Red = MAX_CARDS.RED;
      }
      await Deck.save();
      break;

    case CardType.YELLOW_PLUS2:
    Deck.Remaining_Add2--;
    if (Deck.Remaining_Add2 < 0) {
        validationErrors.push("Yellow Add 2 drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      Deck.Remaining_Red += 2;
      if(Deck.Remaining_Red > MAX_CARDS.RED){
        Deck.Remaining_Red = MAX_CARDS.RED;
      }
      await Deck.save();
      break;

      case CardType.YELLOW_PLUS3:
      Deck.Remaining_Add3--;
      if (Deck.Remaining_Add3 < 0) {
        validationErrors.push("Yellow Add 3 drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      Deck.Remaining_Red += 3;
      if(Deck.Remaining_Red > MAX_CARDS.RED){
        Deck.Remaining_Red = MAX_CARDS.RED;
      }
      await Deck.save();
      break;

      case CardType.YELLOW_MINUS1:
        Deck.Remaining_Remove1--;
        if (Deck.Remaining_Remove1 < 0) {
        validationErrors.push("Yellow Remove 1 drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      Deck.Remaining_Red--;
      if(Deck.Remaining_Red < 0) {
        Deck.Remaining_Red = 0;
      }
      await Deck.save();
      break;

      case CardType.YELLOW_MINUS2:
      Deck.Remaining_Remove2--;
      if (Deck.Remaining_Remove2 < 0) {
        validationErrors.push("Yellow Remove 2 drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      Deck.Remaining_Red -= 2;
      if(Deck.Remaining_Red < 0) {
        Deck.Remaining_Red = 0;
      }
      await Deck.save();
      break;

    case CardType.FREEZE:
      Deck.Remaining_Freeze--;
      if (Deck.Remaining_Freeze < 0) {
        validationErrors.push("Freeze card drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      // create and add freeze
      // not sure of units for Deck.Chance_Period and Freeze.EndTime, but both are ints
      // Freeze.Started is initialized with Date.now() which is milliseconds since 1970
      // Freeze.EndTime should probably be the same
      // ChancePeriod is validated to range of 1 - 1440, so appears to Minutes, so multiply
      // duration by 60 to get seconds, and 1000 to get ms.
      const FreezeDuration = Deck.Chance_Period * (2 + 2 * Math.random()) * 60000 // milliseconds
      const Freeze = await models.Freeze.create({
        Type: "Card",
        Started: Date.now(),
        EndTime:Date.now() + FreezeDuration
      });
      LockSearch.set({
        Current_Freeze_ID: Freeze.Freeze_ID
      });
      LockSearch.Chances--;
      await Deck.save();
      await LockSearch.save();
      break;

    case CardType.DOUBLE:
      Deck.Remaining_Double--;
      if (Deck.Remaining_Double < 0) {
        validationErrors.push("Double card drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      // double Reds and Yellows and check maximums
      // I don't think there's any way to avoiding repeating myself here since database field names are not arrays
      Deck.Remaining_Red *= 2;
      if(Deck.Remaining_Red > MAX_CARDS.RED){
        Deck.Remaining_Red = MAX_CARDS.RED;
      }
      Deck.Remaining_Add1 *= 2;
      if(Deck.Remaining_Add1 > MAX_CARDS.YELLOW_PLUS1){
        Deck.Remaining_Add1 = MAX_CARDS.YELLOW_PLUS1;
      }      
      Deck.Remaining_Add2 *= 2;
      if(Deck.Remaining_Add2 > MAX_CARDS.YELLOW_PLUS2){
        Deck.Remaining_Add2 = MAX_CARDS.YELLOW_PLUS2;
      }      
      Deck.Remaining_Add3 *= 2;
      if(Deck.Remaining_Add3 > MAX_CARDS.YELLOW_PLUS3){
        Deck.Remaining_Add3 = MAX_CARDS.YELLOW_PLUS3;
      }      
      Deck.Remaining_Remove1 *= 2;
      if(Deck.Remaining_Remove1 > MAX_CARDS.YELLOW_MINUS1){
        Deck.Remaining_Remove1 = MAX_CARDS.YELLOW_MINUS1;
      }      
      Deck.Remaining_Remove2 *= 2;
      if(Deck.Remaining_Remove2 > MAX_CARDS.YELLOW_MINUS2){
        Deck.Remaining_Remove2 = MAX_CARDS.YELLOW_MINUS2;
      }
      await Deck.save();
      break;

      case CardType.RESET:
      Deck.Remaining_Reset--;
      if (Deck.Remaining_Reset < 0) {
        validationErrors.push("Reset card drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      // Card reset sets chances to 1
      LockSearch.Chances = 1;
      // need to find and retrieve fields from OriginalLockType
      // CreatedLock_ID is apparently referring to PK of CreatedLock, but no FK declared in model
      const crLock = await models.CreatedLock.findOne(LockSearch.CreatedLock_ID)
      if (crLock === null ) {
        validationErrors.push("Could not find CreatedLock record");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      if(crLock.OriginalLockType_ID === null) {
        validationErrors.push("Could not find OriginalLockType record");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      // try to use code in loadOriginalLockType, but it actually creates a LoadedOriginalLock
      // record in DB, so will need to delete it at end
      const NewDeck = await loadOriginalLockType(crLock);
      // modify greens, reds, yellow, and greens found, but nothing else
      Deck.Found_Green = 0
      Deck.Remaining_Green = NewDeck.Remaining_Green;
      Deck.Remaining_Red = NewDeck.Remaining_Red;
      Deck.Remaining_Add1 = NewDeck.Remaining_Add1;
      Deck.Remaining_Add2 = NewDeck.Remaining_Add2;
      Deck.Remaining_Add3 = NewDeck.Remaining_Add3;
      Deck.Remaining_Remove1 = NewDeck.Remaining_Remove1;
      Deck.Remaining_Remove2 = NewDeck.Remaining_Remove2;
      Deck.Found_Green = NewDeck.Found_Green;
      // clean up by removing NewDeck record from DB
      await NewDeck.destroy();
      await Deck.save();
      await LockSearch.save();
      break;
    case CardType.GO_AGAIN:
      Deck.Remaining_GoAgain--;
      if (Deck.Remaining_GoAgain < 0) {
        validationErrors.push("Go Again card drawn, but not in deck");
        throw new UserInputError("Cannot apply card", {
          invalidArgs: validationErrors
        });
      }
      await Deck.save();
      break;
  }

  return LockSearch
}

module.exports = loadLock;
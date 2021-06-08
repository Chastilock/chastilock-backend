const { UserInputError } = require("apollo-server-errors");
const { LoadedOriginalLock, LoadedLock, CreatedLock } = require("../models");
const loadOriginalLockType = require('./loadOriginalLockType');
import { CardType } from 'graphql'

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

/**
 * Applies a drawn card to the lock.  Both the lock and the associated deck 
 * of type LoadedOriginal Lock may be modified.
 * @param {CardType} card - The card to be applied. Must be an enumerated value of {CardType} defined 
 * defined in the GraphQL schema
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The card must be an enumerated value of CardType and the lock's must have a 
 * related deck record in the DB which must contain at least one card of the type card.
 */
async function applyCard(card, lock) {
  let deck_ID = lock.Original_Lock_Deck;
  const deck = await models.LoadedOriginalLock.findByPK(deck_ID)
  if (deck === null) { // shouldn't be unless there's a DB issue
    validationErrors.push("DB Error - There is no deck linked to the lock???")
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  if (card === CardType.GREEN) {
    applyGreen(deck, lock);
  } else if (card === CardType.RED) {
    applyRed(deck, lock);
  } else if (card === CardType.STICKY) {
    applySticky(deck, lock);
  } else if (card === CardType.YELLOW_PLUS1) {
    applyYellowPlus1(deck, lock);
  } else if (card === CardType.YELLOW_PLUS2) {
    applyYellowPlus2(deck, lock);
  } else if (card === CardType.YELLOW_PLUS3) {
    applyYellowPlus3(deck, lock);
  } else if (card === CardType.YELLOW_MINUS1) {
    applyYellowMinus1(deck, lock);
  } else if (card === CardType.YELLOW_MINUS2) {
    applyYellowMinus2(deck, lock);
  } else if (card === CardType.FREEZE) {
    applyFreeze(deck, lock);
  } else if (card === CardType.DOUBLE) {
    applyDouble(deck, lock);
  } else if (card === CardType.RESET) {
    applyReset(deck, lock);
  } else if (card === CardType.GO_AGAIN) {
    applyGoAgain(deck, lock);
  } else {
    validationErrors.push("Invalid type of card")
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });    
  }
}

// deck should be of type models.LoadedOriginalLock, lock should be of type models.LoadedLock, 
/**
 * Applies a red card to the current deck of a lock and then updates deck and lock in the DB.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a red card.
 */
async function applyRedCard(deck, lock) {
  deck.Remaining_Red--;
  if (deck.Remaining_Red < 0) {
    validationErrors.push("Red drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  await deck.save();
  lock.Chances--;
  await lock.save();
}

/**
 * Applies a green card to the current deck of a lock and then updates deck in the DB. 
 * The lock is not modified and the function does not check whether the lock is complete.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a green card.
*/
async function applyGreenCard(deck, lock) {
  deck.Remaining_Green--;
  if (deck.Remaining_Green < 0) {
    validationErrors.push("Green drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  deck.Found_Green++;
  await deck.save();
}

/**
 * Applies a sticky card to the current deck of a lock and then updates lock in the DB.
 * The deck is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a sticky card.
 */
async function applyStickyCard(deck, lock) {
  if (deck.Remaining_Sticky < 1) {
    validationErrors.push("Sticky drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  lock.Chances--;
  await lock.save();
}

/**
 * Applies a yellow add 1 card to the current deck of a lock and then updates deck in the DB.
 * The lock is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a yellow add 1 card.
*/
async function applyYellowPlus1Card(deck, lock) {
  deck.Remaining_Add1--;
  if (deck.Remaining_Add1 < 0) {
    validationErrors.push("Yellow Add 1 drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  deck.Remaining_Red++;
  if(deck.Remaining_Red > MAX_CARDS.RED){
    deck.Remaining_Red = MAX_CARDS.RED;
  }
  await deck.save();
}

/**
 * Applies a yellow add 2 card to the current deck of a lock and then updates deck in the DB.
 * The lock is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a yellow add 2 card.
*/
async function applyYellowPlus2Card(deck, lock) {
  deck.Remaining_Add2--;
  if (deck.Remaining_Add2 < 0) {
      validationErrors.push("Yellow Add 2 drawn, but not in deck");
      throw new UserInputError("Cannot apply card", {
        invalidArgs: validationErrors
      });
    }
    deck.Remaining_Red += 2;
    if(deck.Remaining_Red > MAX_CARDS.RED){
      deck.Remaining_Red = MAX_CARDS.RED;
    }
    await deck.save();

}

/**
 * Applies a yellow add 3 card to the current deck of a lock and then updates deck in the DB.
 * The lock is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a yellow add 3 card.
 */
async function applyYellowPlus3Card(deck, lock) {
  deck.Remaining_Add3--;
  if (deck.Remaining_Add3 < 0) {
    validationErrors.push("Yellow Add 3 drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  deck.Remaining_Red += 3;
  if(deck.Remaining_Red > MAX_CARDS.RED){
    deck.Remaining_Red = MAX_CARDS.RED;
  }
  await deck.save();
}

/**
 * Applies a yellow remove 1 card to the current deck of a lock and then updates deck in the DB.
 * The lock is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a yellow remove 1 card.
*/
async function applyYellowMinus1Card(deck, lock) {
  deck.Remaining_Remove1--;
  if (deck.Remaining_Remove1 < 0) {
    validationErrors.push("Yellow Remove 1 drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  deck.Remaining_Red--;
  if(deck.Remaining_Red < 0) {
    deck.Remaining_Red = 0;
  }
  await deck.save();
}

/**
 * Applies a yellow remove 2 card to the current deck of a lock and then updates deck in the DB.
 * The lock is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a yellow remove 2 card.
*/
async function applyYellowMinus2Card(deck, lock) {
  deck.Remaining_Remove2--;
  if (deck.Remaining_Remove2 < 0) {
    validationErrors.push("Yellow Remove 2 drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  deck.Remaining_Red -= 2;
  if(deck.Remaining_Red < 0) {
    deck.Remaining_Red = 0;
  }
  await deck.save();
}

/**
 * Applies a freeze card to the current deck of a lock and then updates deck and lock in the DB.
 * A new Freeze is created and saved in the database and linked to the lock.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a freeze card.
*/
async function applyFreezeCard(deck, lock) {
  deck.Remaining_Freeze--;
  if (deck.Remaining_Freeze < 0) {
    validationErrors.push("Freeze card drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  // create and add freeze
  // not sure of units for Deck.Chance_Period and Freeze.EndTime, but both are ints
  // Freeze.Started is initialized with Date.now() which is milliseconds since 1970
  // Freeze.EndTime should probably be the same
  // ChancePeriod is validated to range of 1 - 1440, so appears to be Minutes, so multiply
  // duration by 60 to get seconds, and 1000 to get ms.
  const freezeLength = Deck.Chance_Period * (2 + 2 * Math.random()) * 60000 // milliseconds
  /**  */
  const Freeze = await models.Freeze.create({
    Type: "Card",
    Started: Date.now(),
    EndTime:Date.now() + freezeLength
  });
  lock.set({
    Current_Freeze_ID: Freeze.Freeze_ID
  });
  lock.Chances--;
  await deck.save();
  await lock.save();
}

/**
 * Applies a double card to the current deck of a lock and then updates deck in the DB.
 * Red cards and all yellow cards are doubled and card limits are applied
 * The lock is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a double card.
*/
async function applyDoubleCard(deck, lock) {
  deck.Remaining_Double--;
  if (deck.Remaining_Double < 0) {
    validationErrors.push("Double card drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  // double Reds and Yellows and check maximums
  // I don't think there's any way to avoiding repeating myself here since database field names are not arrays
  deck.Remaining_Red *= 2;
  if(deck.Remaining_Red > MAX_CARDS.RED){
    deck.Remaining_Red = MAX_CARDS.RED;
  }
  deck.Remaining_Add1 *= 2;
  if(deck.Remaining_Add1 > MAX_CARDS.YELLOW_PLUS1){
    deck.Remaining_Add1 = MAX_CARDS.YELLOW_PLUS1;
  }      
  deck.Remaining_Add2 *= 2;
  if(deck.Remaining_Add2 > MAX_CARDS.YELLOW_PLUS2){
    deck.Remaining_Add2 = MAX_CARDS.YELLOW_PLUS2;
  }      
  deck.Remaining_Add3 *= 2;
  if(deck.Remaining_Add3 > MAX_CARDS.YELLOW_PLUS3){
    deck.Remaining_Add3 = MAX_CARDS.YELLOW_PLUS3;
  }      
  deck.Remaining_Remove1 *= 2;
  if(deck.Remaining_Remove1 > MAX_CARDS.YELLOW_MINUS1){
    deck.Remaining_Remove1 = MAX_CARDS.YELLOW_MINUS1;
  }      
  deck.Remaining_Remove2 *= 2;
  if(deck.Remaining_Remove2 > MAX_CARDS.YELLOW_MINUS2){
    deck.Remaining_Remove2 = MAX_CARDS.YELLOW_MINUS2;
  }
  await deck.save();
}

/**
 * Applies a reset card to the current deck of a lock and then updates deck and lock in the DB.
 * Green, red, and all yellow cards are reset to the the specification found in the related 
 * OriginalLockType record, while lock.Chances is reset to 1
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a reset card.
*/
async function applyResetCard(deck, lock) {
  deck.Remaining_Reset--;
  if (deck.Remaining_Reset < 0) {
    validationErrors.push("Reset card drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  lock.Chances = 1;
  // need to find and retrieve fields from OriginalLockType
  // CreatedLock_ID is apparently referring to PK of CreatedLock, but no FK declared in model
  /**
   * crLock is the CreatedLock object from which lock was created. 
   * @type {CreatedLock} */
  const crLock = await models.CreatedLock.findOne(LockSearch.CreatedLock_ID)
  if (crLock === null ) {
    validationErrors.push("Could not find CreatedLock record");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  if(crLock.OriginalLockType_ID === null) {
    validationErrors.push("DB Error: There is no OriginalLockType record linked to the lock");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  // use code in loadOriginalLockType, but it actually creates a LoadedOriginalLock
  // record in DB, so will need to delete it at end
  // TODO: refactor loadOriginalLock to expose and use helper function that does not actually 
  // create a record in the DB
  const newDeck = await loadOriginalLockType(crLock);
  // modify greens, reds, yellow, and Found_Green counts, but nothing else
  deck.Found_Green = 0
  deck.Remaining_Green = newDeck.Remaining_Green;
  deck.Remaining_Red = newDeck.Remaining_Red;
  deck.Remaining_Add1 = newDeck.Remaining_Add1;
  deck.Remaining_Add2 = newDeck.Remaining_Add2;
  deck.Remaining_Add3 = newDeck.Remaining_Add3;
  deck.Remaining_Remove1 = newDeck.Remaining_Remove1;
  deck.Remaining_Remove2 = newDeck.Remaining_Remove2;
  // clean up by removing newDeck record from DB
  await newDeck.destroy();
  await deck.save();
  await lock.save();
}

/**
 * Applies a go again card to the current deck of a lock and then updates deck in the DB.
 * The lock is not modified.
 * @param {LoadedOriginalLock} deck 
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The deck must contain a go again card.
*/
async function applyGoAgainCard(deck, lock) {
  deck.Remaining_GoAgain--;
  if (dDeck.Remaining_GoAgain < 0) {
    validationErrors.push("Go Again card drawn, but not in deck");
    throw new UserInputError("Cannot apply card", {
      invalidArgs: validationErrors
    });
  }
  await deck.save();
}

module.exports = { applyCard }
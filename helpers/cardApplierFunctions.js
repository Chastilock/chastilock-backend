const { UserInputError } = require("apollo-server-errors");
const { LoadedOriginalLock, LoadedLock, CreatedLock, Freeze } = require("../models");
const { loadOriginalLockType } = require('./loadOriginalLockType');
const { MAX_CARDS } = require('./max_cards')
const { CardType } = require('graphql')


//TODO: Freeze, Red, Sticky and Reset cards modify chances.  It's possible we may also need to modify code for other cards if it turns out to
// be important to keep track of when the last draw occurred.

/**
 * Applies a drawn card to the deck of the lock.  Both the lock and the associated deck 
 * of type LoadedOriginal Lock may be modified.
 * @param {CardType} card - The card to be applied. Must be an enumerated value of {CardType} defined 
 * defined in the GraphQL schema
 * @param {LoadedLock} lock 
 * @returns {void}
 * @throws {UserInputError} The card must be an enumerated value of CardType and the lock's must have a 
 * related deck record in the DB which must contain at least one card of the type card.
 */
async function applyCardToLockDeck(card, lock) {
  let deck_ID = lock.Original_Lock_Deck;
  const deck = await LoadedOriginalLock.findByPk(deck_ID)
  if (!deck) { // shouldn't be unless there's a DB issue
    //TODO: Work out what to do in this case. I think the lock should be unlocked
    throw new Error("DB Error - There is no deck linked to the lock???");
  }
  if (card === "GREEN") {
    await applyGreenCard(deck, lock);
  } else if (card === "RED") {
    await applyRedCard(deck, lock);
  } else if (card === "STICKY") {
    await applyStickyCard(deck, lock);
  } else if (card === "YELLOW_PLUS1") {
    await applyYellowPlus1Card(deck, lock);
  } else if (card === "YELLOW_PLUS2") {
    await applyYellowPlus2Card(deck, lock);
  } else if (card === "YELLOW_PLUS3") {
    await applyYellowPlus3Card(deck, lock);
  } else if (card === "YELLOW_MINUS1") {
    await applyYellowMinus1Card(deck, lock);
  } else if (card === "YELLOW_MINUS2") {
    await applyYellowMinus2Card(deck, lock);
  } else if (card === "FREEZE") {
    await applyFreezeCard(deck, lock);
  } else if (card === "DOUBLE") {
    await applyDoubleCard(deck, lock);
  } else if (card === "RESET") {
    await applyResetCard(deck, lock);
  } else if (card === "GO_AGAIN") {
    await applyGoAgainCard(deck, lock);
  } else {
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Invalid type of card"
    });    
  }
  // TODO:  Probably need to add code here to update a field to keep track of when last card drawn for non-cumulative locks
  // That should be located here, since the above fxn calls may throw errors if the card can not be applied.
}

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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Red drawn, but not in deck"
    });
  }
  deck.Chances_Remaining--;
  await deck.save();
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Green drawn, but not in deck"
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Sticky drawn, but not in deck"
    });
  }
  deck.Chances_Remaining--;
  await deck.save();
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Yellow Add 1 drawn, but not in deck"
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
      throw new UserInputError("Cannot apply card", {
        invalidArgs: "Yellow Add 2 drawn, but not in deck"
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Yellow Add 3 drawn, but not in deck"
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Yellow Remove 1 drawn, but not in deck"
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Yellow Remove 2 drawn, but not in deck"
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Freeze card drawn, but not in deck"
    });
  }
  // create and add freeze
  // not sure of units for Deck.Chance_Period and Freeze.EndTime, but both are ints
  // Freeze.Started is initialized with Date.now() which is milliseconds since 1970
  // Freeze.EndTime should probably be the same
  // ChancePeriod is validated to range of 1 - 1440, so appears to be Minutes, so multiply
  // duration by 60 to get seconds, and 1000 to get ms.
  const freezeLength = lock.Chance_Period * (2 + 2 * Math.random()) * 60000 // milliseconds
  /** @type { Freeze } */
  const freeze = await Freeze.create({
    Lock_ID: lock.LoadedLock_ID,
    Type: "Card",
    Started: Date.now(),
    EndTime:Date.now() + freezeLength
  });
  lock.set({
    Current_Freeze_ID: freeze.Freeze_ID
  });
  deck.Chances_Remaining--;
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Double card drawn, but not in deck"
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
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Reset card drawn, but not in deck"
    });
  }

  deck.Chances_Remaining--;
  deck.Chances_Last_Calulated = Date.now()

  // need to find and retrieve fields from OriginalLockType
  /**
   * crLock is the CreatedLock object from which lock was created. 
   * @type {CreatedLock} */
  const crLock = await CreatedLock.findByPk(lock.CreatedLock_ID)
  if (crLock === null ) {
    throw new Error("DB Error: Could not find CreatedLock record");
  }
  if(crLock.OriginalLockType_ID === null) {
    throw new Error("DB Error: There is no OriginalLockType record linked to the lock");
  }
  // use code in loadOriginalLockType, but it actually creates a LoadedOriginalLock
  // record in DB, so will need to delete it at end
  // TODO: ?? refactor loadOriginalLock to expose and use helper function that does not actually 
  // create a record in the DB
  /** @type {LoadedOriginalDeck} */
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
  if (deck.Remaining_GoAgain < 0) {
    throw new UserInputError("Cannot apply card", {
      invalidArgs: "Go Again card drawn, but not in deck"
    });
  }
  await deck.save();
}

module.exports = { applyCardToLockDeck }
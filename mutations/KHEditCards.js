const { AuthenticationError, ApolloError, UserInputError } = require('apollo-server-express');
const {MIN_CARDS, MAX_CARDS } = require('../helpers/max_cards');
const { LoadedLock, LoadedOriginalLock } = require('../models')
const { CardMap } = require('../classes/cardMap')

// TODO: If/when trust structure is changed, then the trust code below will need to be revised.
// TODO: Eventually will need the ability to have hidden edits. Parameter included for now and ignored.

/*
    KHEditCards(
      LoadedLock_ID: Int!, 
      Deck: DeckInput!, 
      HiddenUpdate: Boolean! // for later
    ): LoadedLock!
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

  deck  = new CardMap(inputs.Deck)
  for (const [key, value] of Object.entries(deck)) {
    if (deck[key] < MIN_CARDS[key] || deck[key] > MAX_CARDS[key]) {
      validationErrors.push('Number of ' + key + ' cards must be between ' +
      MIN_CARDS[key] + ' and ' + MAX_CARDS[key] + ', inclusive')
    }
  }
  // tested including boundaries

  if (!LockSearch.Original_Lock_Deck)
  {
    validationErrors.push('The specified lock is not a card lock, so cannot edit the cards')
    throw new UserInputError("Cannot edit lock", { // No need to process further, so throw Error here
      invalidArgs: validationErrors
    });
  }

  // code to retrieve the loadedOriginalLock
  /** @type { loadedOriginalLock } */
  const loadedCards = await LoadedOriginalLock.findByPk(LockSearch.Original_Lock_Deck)
  if (!loadedCards) {
    throw Error("DB Error - could not find LoadedOriginalLock")
  }

// assuming we got here the Loaded Lock and the LoadedOriginalLock records have been found and retrieved.
// some validation errors may be pending since we only threw them if the lock was not a card lock

//TODO:  If/when Trusted structure is revise, modification will be needed.
if (!LockSearch.Trusted) {
    // TODO: add Last_KH_Change to DB, models and schema, and uncomment following code after checking
    // In CK, untrusted KHs can only modify every half interval
    // need to check units here. Date.now and lastKHmod will both be millisecs since Epoch, I think.
    // chance period is minutes, so conversion factor is 60000; so half inteval = 30000
   if(LockSearch.Last_KH_Change &&       //KH has modified lock previously
        (Date.now() - LockSearch.Last_KH_Change ) < (LockSearch.Chance_Period * 30000) ){
      validationErrors.push("Premature attempt by UNTRUSTED keyholder to modify lock")
    }
    // deck is input values; loadedCards is the current cards
    if (loadedCards.Multiple_Greens_Required && deck.GREEN > loadedCards.Remaining_Green) {
      validationErrors.push("Untrusted keyholders cannot add green cards if multiple greens are required")
    }
    if (deck.RED > loadedCards.Remaining_Red + 7) {
      validationErrors.push("Untrusted keyholders cannot add more than 7 red cards")
    }
    if (deck.YELLOW_PLUS1 > loadedCards.Remaining_Add1 + 3  ||
      deck.YELLOW_PLUS2 > loadedCards.Remaining_Add2 + 3  ||
      deck.YELLOW_PLUS3 > loadedCards.Remaining_Add3 + 3  ||
      deck.YELLOW_MINUS1 > loadedCards.Remaining_Remove1 + 3  ||
      deck.YELLOW_MINUS1 > loadedCards.Remaining_Remove2 + 3  ) {
        validationErrors.push("Untrusted keyholders cannot add more than 3 yellow cards of the same type")
    }
    if (deck.STICKY > loadedCards.Remaining_Sticky || 
        deck.FREEZE > loadedCards.Remaining_Freeze ||
        deck.DOUBLE > loadedCards.Remaining_Double || 
        deck.RESET > loadedCards.Remaining_Reset) {
          validationErrors.push("Untrusted keyholders cannot add sticky, freeze, double, or reset cards")
    }
} // TODO: The above validation for untrusted keyholders needs tested

  if (validationErrors.length) {
    throw new UserInputError("Cannot edit lock", {
      invalidArgs: validationErrors
    });
  }

  loadedCards.Remaining_Green = deck.GREEN
  loadedCards.Remaining_Red = deck.RED
  loadedCards.Remaining_Sticky = deck.STICKY 
  loadedCards.Remaining_Add1 = deck.YELLOW_PLUS1 
  loadedCards.Remaining_Add2 = deck.YELLOW_PLUS2 
  loadedCards.Remaining_Add3 = deck.YELLOW_PLUS3 
  loadedCards.Remaining_Remove1 = deck.YELLOW_MINUS1 
  loadedCards.Remaining_Remove2 = deck.YELLOW_MINUS2 
  loadedCards.Remaining_Freeze = deck.FREEZE 
  loadedCards.Remaining_Double = deck.DOUBLE
  loadedCards.Remaining_Reset = deck.RESET 
  // ??? TODO: Possibly update GoAgain cards here ???
  await loadedCards.save()
  LockSearch.Last_KH_Change = Date.now()
  await LockSearch.save()

  return LockSearch
}

module.exports = KHEditCards;

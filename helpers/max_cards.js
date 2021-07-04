// if relocated/refactored, this file is used by:
//     /helpers/cardAppliersFunctions.js
//     /mutations/createOriginalLock.js
//     /mutations/applyKHCardEdit.js (my code only so far)

const MAX_CARDS = {
// for cards in a deck
  GREEN : 100, /* Same as CK */
  RED : 599, /* Same as CK */
  STICKY : 100, /* Same as CK */
  YELLOW_PLUS1 : 299, /* Same as CK */
  YELLOW_PLUS2 : 299, /* Same as CK */
  YELLOW_PLUS3 : 299, /* Same as CK */
  YELLOW_MINUS1 : 299, /* Same as CK */
  YELLOW_MINUS2 : 299, /* Same as CK */
  FREEZE : 100, /* Same as CK */
  DOUBLE : 100, /* Same as CK */
  RESET : 100, /* Same as CK */
// for yellow card categories on lock creation
  YELLOW_ADD_RED: 299, /* Same as CK */
  YELLOW_REMOVE_RED: 299, /* Same as CK */
  YELLOW_RANDOM_RED: 299 /* Same as CK */
};
const MIN_CARDS = {
  // for cards in a deck
    GREEN : 1, /* Same as CK */
    RED : 0, /* Same as CK */
    STICKY : 0, /* Same as CK */
    YELLOW_PLUS1 : 0, /* Same as CK */
    YELLOW_PLUS2 : 0, /* Same as CK */
    YELLOW_PLUS3 : 0, /* Same as CK */
    YELLOW_MINUS1 : 0, /* Same as CK */
    YELLOW_MINUS2 : 0, /* Same as CK */
    FREEZE : 0, /* Same as CK */
    DOUBLE : 0, /* Same as CK */
    RESET : 0, /* Same as CK */
    GO_AGAIN: 0
}

module.exports =  { MIN_CARDS, MAX_CARDS };
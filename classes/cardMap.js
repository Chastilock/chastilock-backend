const MAX_CARDS = require('../helpers/max_cards')
//import CardType, { isYellowCard } from './CardType'
// TODO: Eventually this should go into the cardgame repository and be imported from there.
// It seems I cannot unfortunately use current CardMapping class from there, since it has a map and
// maps are dynamically typed and therefore cannot be used in input type in GraphQL since
// input types are required to be statically typed, that is, the keys must be known
class CardMap {
  // required properties 
/*  GREEN = 0
  RED = 0
  STICKY = 0
  YELLOW_PLUS1 = 0
  YELLOW_PLUS2 = 0
  YELLOW_PLUS3 = 0
  YELLOW_MINUS1 = 0
  YELLOW_MINUS2 = 0
  FREEZE = 0
  DOUBLE = 0
  RESET = 0
  GO_AGAIN = 0
*/
  // deck should be an object that has properties corresponding to 
  constructor (deck) {
    this.GREEN = deck.GREEN //  either an int or undefined
    this.RED = deck.RED
    this.STICKY = deck.STICKY
    this.YELLOW_PLUS1 = deck.YELLOW_PLUS1
    this.YELLOW_PLUS2 = deck.YELLOW_PLUS2
    this.YELLOW_PLUS3 = deck.YELLOW_PLUS3
    this.YELLOW_MINUS1 = deck.YELLOW_MINUS1
    this.YELLOW_MINUS2 = deck.YELLOW_MINUS2
    this.FREEZE = deck.FREEZE
    this.DOUBLE = deck.DOUBLE
    this.RESET = deck.RESET
    this.GO_AGAIN = deck.GO_AGAIN
  }
  TOTAL() {
    return Object.values(this).reduce((prev, cur) => prev + cur, 0)
  }

  // these could be added to this class, but the code would need to be modified to remove
/*
  public getCardsOfType (type: CardType): number {
    return this.map.get(type) ?? 0
  }

  public setCardsOfType (type: CardType, cards: number): void {
    this.map.set(type, cards)
  }


  public drawRandomType (): CardType {
    const totalCards = this.getTotalCards()

    let accumulator = 0
    const chances = Array.from(this.map.values()).map((element: number) => (accumulator = accumulator + element))
    const drawnIndex = Math.random() * totalCards
    const drawnCard = Array.from(this.map.keys())[chances.filter(element => element <= drawnIndex).length]

    return drawnCard
  }

  public getTotalCards (): number {
    return Array.from(this.map.values()).reduce((prev: number, cur: number) => prev + cur, 0)
  }

  public getGreen (): number {
    return this.getCardsOfType(CardType.GREEN)
  }

  public getRed (): number {
    return this.getCardsOfType(CardType.RED)
  }

  public getSticky (): number {
    return this.getCardsOfType(CardType.STICKY)
  }

  public getFreeze (): number {
    return this.getCardsOfType(CardType.FREEZE)
  }

  public getDouble (): number {
    return this.getCardsOfType(CardType.DOUBLE)
  }

  public getReset (): number {
    return this.getCardsOfType(CardType.RESET)
  }

  public getGoAgain (): number {
    return this.getCardsOfType(CardType.GO_AGAIN)
  }

  public getYellow (): number {
    let yellow = 0

    this.map.forEach((value: number, key: CardType) => {
      if (isYellowCard(key)) {
        yellow = yellow + value
      }
    })

    return yellow
  }


  public copyDeep (): CardMapping {
    const clone = new CardMapping()
    this.map.forEach((value: number, key: CardType) => {
      clone.setCardsOfType(key, value)
    })
    return clone
  }
  */
}
/* Deck output object cut from schema and saved for possible use later.
   This doesn't make the app programming any easier than the current LoadedOriginalLock fields containing the card amounts
  type Deck {
    GREEN: Int
    RED: Int
    STICKY: Int
    YELLOW_PLUS1: Int
    YELLOW_PLUS2: Int
    YELLOW_PLUS3: Int
    YELLOW_MINUS1: Int
    YELLOW_MINUS2: Int
    FREEZE: Int
    DOUBLE: Int
    RESET: Int
    GO_AGAIN: Int
    TOTAL: Int #just to see how this works
  }
*/
//const max_Deck = new Deck()

module.exports = { CardMap }

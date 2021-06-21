
//import CardType, { isYellowCard } from './CardType'
// TODO: Eventually this should go into the cardgame repository and be imported from there.
// It seems I cannot unfortunately use current CardMapping class from there, since it has a map and
// maps are dynamically typed and therefore cannot be used in input type in GraphQL since
// input types are required to be statically typed, that is, the keys must be known
class CardMap {
  // required properties 
  GREEN = 0
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

  // deck should be an object that has properties corresponding to 
  constructor (deck) {
    // ensure that all properties have values
    this.GREEN = deck.GREEN || 0
    this.RED = deck.RED || 0
    this.STICKY = deck.STICKY || 0
    this.YELLOW_PLUS1 = deck.YELLOW_PLUS1 || 0
    this.YELLOW_PLUS2 = deck.YELLOW_PLUS2 || 0
    this.YELLOW_PLUS3 = deck.YELLOW_PLUS3 || 0
    this.YELLOW_MINUS1 = deck.YELLOW_MINUS1 || 0
    this.YELLOW_MINUS2 = deck.YELLOW_MINUS2 || 0
    this.FREEZE = deck.FREEZE || 0
    this.DOUBLE = deck.DOUBLE || 0
    this.RESET = deck.RESET || 0
    this.GO_AGAIN = deck.GO_AGAIN || 0
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

module.exports = CardMap

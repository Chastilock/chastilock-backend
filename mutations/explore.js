/*
schema input type
  input DeckInput {
    GREEN: Int
    RED: Int
  }

  type Deck {
    GREEN: Int!
    RED: Int!
    STICKY: Int!
    TOTAL: Int!
  }

schema mutation  
    explore(deck: DeckInput!) : Deck!

resolver:
  async explore(root, args, {models, req}) {
    return explore(args, models, req);
  }
*/

const CardMap  = require("../classes/cardMap");

async function explore(inputs, models, req) {
  const data = inputs.deck
  const hasGreen = "GREEN" in data;
  const numGreen = data.GREEN;
  const deck = new CardMap(data)
  console.log(data);


  // stub for now
  return deck;
}
module.exports = explore;
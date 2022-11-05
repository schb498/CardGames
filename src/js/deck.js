const CARD_SUIT = ["♠", "♥", "♣", "♦"];

export const CARD_VALUE = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export class Deck {
  constructor(cardList) {
    if (cardList === undefined) {
      this.cardDeck = newDeck();
    } else {
      this.cardDeck = cardList;
    }
  }

  show() {
    let allCards = "";
    for (let i = 0; i < this.cardDeck.length; i++) {
      allCards += this.cardDeck[i].show() + " ";
    }
    return allCards;
  }

  takeRandomCards(count) {
    let hand = [];
    for (let i = 0; i < count; i++) {
      let card =
        this.cardDeck[Math.floor(Math.random() * this.cardDeck.length)];
      // Adds random card from deck into hand
      hand.push(card);
      this.remove(card);
    }
    return hand;
  }

  pickRandom() {
    return this.cardDeck[Math.floor(Math.random() * this.cardDeck.length)];
  }

  take(hand, card) {
    if (this.remove(card)) {
      hand.add(card);
    }
  }

  find(card) {
    for (let i = 0; i < this.cardDeck.length; i++) {
      if (this.cardDeck[i].show() === card.show()) {
        return true;
      }
    }
  }

  add(card) {
    this.cardDeck.push(card);
  }

  remove(card) {
    const cardName = card.show();
    let exists = false;
    for (let i = 0; i < this.cardDeck.length; i++) {
      if (this.cardDeck[i].show() === cardName) {
        this.cardDeck.splice(i, 1);
        exists = true;
      }
    }
    return exists;
  }

  shuffle() {
    for (let i = this.cardDeck.length - 1; i >= 0; i--) {
      const pos = Math.floor(Math.random() * (i + 1));
      const curPosValue = this.cardDeck[i];
      this.cardDeck[i] = this.cardDeck[pos];
      this.cardDeck[pos] = curPosValue;
    }
  }
}

export class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  show() {
    return this.suit + this.value;
  }
}

function newDeck() {
  let deck = [];
  for (let i = 0; i < CARD_SUIT.length; i++) {
    for (let j = 0; j < CARD_VALUE.length; j++) {
      deck.push(new Card(CARD_SUIT[i], CARD_VALUE[j]));
    }
  }
  return deck;
}

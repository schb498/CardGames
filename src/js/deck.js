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

  showCards() {
    let allCards = "";
    for (let i = 0; i < this.cardDeck.length; i++) {
      allCards += this.cardDeck[i].showName() + " ";
    }
    return allCards;
  }

  takeRandomCards(hand, count) {
    let cardsTaken = [];
    for (let i = 0; i < count; i++) {
      let card =
        this.cardDeck[Math.floor(Math.random() * this.cardDeck.length)];
      // Adds random card from deck into hand
      cardsTaken.push(card);
      this.take(hand, card);
    }
    return cardsTaken;
  }

  pickRandom() {
    return this.cardDeck[Math.floor(Math.random() * this.cardDeck.length)];
  }

  /**
   * Takes the input card (if it exists) from this deck and adds it into the hand given by the input
   * @param {*} hand: the deck that is receiving the card
   * @param {*} card: the card that is taken from this deck
   */
  take(hand, card) {
    // Checks if card exists
    if (this.remove(card)) {
      hand.add(card);
    }
  }

  find(card) {
    for (let i = 0; i < this.cardDeck.length; i++) {
      if (this.cardDeck[i].showName() === card.showName()) {
        return true;
      }
    }
  }

  add(card) {
    this.cardDeck.push(card);
  }

  remove(card) {
    let exists = false;
    for (let i = 0; i < this.cardDeck.length; i++) {
      if (this.cardDeck[i].showName() === card.showName()) {
        this.cardDeck.splice(i, 1);
        exists = true;
      }
    }
    return exists;
  }

  getAllBooks() {
    let cardValueCount = {
      A: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      J: 0,
      Q: 0,
      K: 0,
    };
    let bookValues = [];
    for (let i = 0; i < this.cardDeck.length; i++) {
      const curCardVal = this.cardDeck[i].value;
      cardValueCount[curCardVal]++;
      if (cardValueCount[curCardVal] === 4) {
        bookValues.push(curCardVal);
      }
    }
    return bookValues;
  }

  removeBooks(bookValues) {
    // Goes through each value in the input string array and removes all cards with the same card value
    for (let i = 0; i < bookValues.length; i++) {
      let j = 0;
      while (j < this.cardDeck.length) {
        if (this.cardDeck[j].value === bookValues[i]) {
          this.cardDeck.splice(j, 1);
          j--;
        }
        j++;
      }
    }
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

  showName() {
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

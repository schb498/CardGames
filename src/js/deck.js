const CARD_SUIT = ["♠", "♥", "♣", "♦"];

const CARD_RANK = [
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
      return true;
    }
  }

  takeAll(hand, cardRank) {
    for (let i = 0; i < CARD_SUIT.length; i++) {
      const card = new Card(CARD_SUIT[i], cardRank);
      this.take(hand, card);
    }
  }

  findRank(cardRank) {
    for (let i = 0; i < this.cardDeck.length; i++) {
      if (this.cardDeck[i].rank === cardRank) {
        return true;
      }
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
    let cardRankCount = {
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
    let bookRanks = [];
    for (let i = 0; i < this.cardDeck.length; i++) {
      const curCardVal = this.cardDeck[i].rank;
      cardRankCount[curCardVal]++;
      if (cardRankCount[curCardVal] === 4) {
        bookRanks.push(curCardVal);
      }
    }
    return bookRanks;
  }

  removeSameRank(cardRanks) {
    let cardsRemoved = [];
    // Goes through each rank value in the input string array and removes all cards with the same card rank
    for (let i = 0; i < cardRanks.length; i++) {
      let j = 0;
      while (j < this.cardDeck.length) {
        if (this.cardDeck[j].rank === cardRanks[i]) {
          cardsRemoved.push(this.cardDeck[j]);
          this.cardDeck.splice(j, 1);
          j--;
        }
        j++;
      }
    }
    return cardsRemoved;
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
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  showName() {
    return this.suit + this.rank;
  }
}

function newDeck() {
  let deck = [];
  for (let i = 0; i < CARD_SUIT.length; i++) {
    for (let j = 0; j < CARD_RANK.length; j++) {
      deck.push(new Card(CARD_SUIT[i], CARD_RANK[j]));
    }
  }
  return deck;
}

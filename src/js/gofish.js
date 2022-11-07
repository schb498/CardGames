import { Deck, Card } from "./deck.js";

let playerHand = new Deck([]);
let computerHand = new Deck([]);
let cardPool;
let isPlayerTurn = true;

document.getElementById("startButton").onclick = function () {
  // Hide pre game area, show game area
  hide("preGameArea");
  show("gameArea");
  resetBoard();
  playerTurn();

  cardPool = new Deck();
  cardPool.shuffle();

  cardPool.takeRandomCards(playerHand, 15);
  cardPool.takeRandomCards(computerHand, 15);

  checkPlayerBooks("initialBook");
  checkComputerBooks("computerInitialBook");
  console.log("Computer: " + computerHand.showCards());

  updatePlayerCardLabel();
};

document.getElementById("requestButton").onclick = function () {
  // Checks if inputs are valid
  if (validRankCheck()) {
    console.log(
      "Requested card rank: " +
        fieldValue("cardRankField").replace(/\s+/g, "").toUpperCase()
    );
    hide("inputOption");
    let cardRank = fieldValue("cardRankField")
      .replace(/\s+/g, "")
      .toUpperCase();
    if (computerHand.findRank(cardRank)) {
      computerHand.takeAll(playerHand, cardRank);
      updatePlayerCardLabel();
      document.getElementById("infoLabel").innerHTML =
        "The Computer has the card! You take the card from the computer";
      show("bookRemove");
      console.log("Computer: " + computerHand.showCards());
      console.log("player: " + playerHand.showCards());
    } else {
      document.getElementById("infoLabel").innerHTML =
        "The Computer does not have the card. GO FISH!";
      show("fishArea");
    }
  }
};

document.getElementById("fishButton").onclick = function () {
  let cardFished = cardPool.pickRandom();
  hide("fishButton");
  show("fishCard");
  document.getElementById("fishCard").innerHTML =
    "You fished out: " + cardFished.showName();
  cardPool.take(playerHand, cardFished);
  updatePlayerCardLabel();
  show("bookRemove");
};

document.getElementById("bookCheckButton").onclick = function () {
  hide("bookCheckButton");
  show("bookCheck");
  let bookRanks = playerHand.getAllBooks();
  if (bookRanks.length !== 0) {
    document.getElementById("bookCheck").innerHTML =
      "You have books for " +
      bookRanks.toString().replaceAll(",", ", ") +
      ". They are removed from your hand";
    playerHand.removeSameRank(bookRanks);
    updatePlayerCardLabel();
  } else {
    document.getElementById("bookCheck").innerHTML =
      "You have no books, no cards were removed";
  }
  show("nextPlayer");
};

document.getElementById("nextPlayerButton").onclick = function () {
  resetBoard();
  if (!isPlayerTurn) {
    computerTurn();
  } else {
    playerTurn();
  }
};

function playerTurn() {
  // Sets up for player's turn
  show("infoLabel");
  show("inputOption");
  show("bookCheckButton");
  show("fishButton");
  hide("bookCheck");
  hide("computerBox");
  hide("fishCard");
  hide("fishArea");
  hide("bookRemove");
  hide("nextPlayer");

  document.getElementById("infoLabel").innerHTML =
    "Request to the computer a card rank for a card in your hand";
  document.getElementById("nextPlayerButton").innerHTML = "Finish turn";
  isPlayerTurn = false;
}

function computerTurn() {
  // Sets up for computer's turn
  hide("fishArea");
  hide("bookRemove");
  show("computerBox");
  const requestedCardRank = [computerRequestCardRank()];
  let cardsRemoved = playerHand.removeSameRank(requestedCardRank);
  if (cardsRemoved.length > 0) {
    document.getElementById("requestResult").innerHTML =
      "You give your card/s with the same rank to the computer";
    for (let i = 0; i < cardsRemoved.length; i++) {
      computerHand.add(cardsRemoved[i]);
    }
    updatePlayerCardLabel();
  } else {
    document.getElementById("requestResult").innerHTML =
      "You do not have the card, the computer fishes for a card";
    cardPool.take(computerHand, cardPool.pickRandom());
  }
  checkComputerBooks("computerBookCheck");
  console.log("Computer: " + computerHand.showCards());
  document.getElementById("nextPlayerButton").innerHTML = "Next turn";
  isPlayerTurn = true;
  show("nextPlayer");
}

function validRankCheck() {
  let text = fieldValue("cardRankField").replace(/\s+/g, "").toUpperCase();
  // Check if text is a valid card rank in player's hand
  for (let i = 0; i < playerHand.cardDeck.length; i++) {
    if (playerHand.cardDeck[i].rank === text) {
      document.getElementById("cardRankLabel").innerHTML =
        "Valid card rank selected";
      return true;
    }
  }
  document.getElementById("cardRankField").value = "";
  document.getElementById("cardRankLabel").innerHTML =
    "Please enter a valid card rank:";
  return false;
}

// Suit selection is not needed for the normal version of the game
function suitSelectCheck() {
  const checkRadio = radioValue('input[name="suit"]:checked');
  if (checkRadio !== null) {
    //document.getElementById("cardSuitLabel").innerHTML =
    checkRadio.getAttribute("id") + " selected";
    return true;
  } else {
    //document.getElementById("cardSuitLabel").innerHTML = "No suit selected";
    return false;
  }
}

function resetBoard() {
  //document.getElementById("cardSuitLabel").innerHTML = "Select the suit:";
  document.getElementById("cardRankLabel").innerHTML = "Enter the card value:";
  if (radioValue('input[name="suit"]:checked') !== null) {
    radioValue('input[name="suit"]:checked').checked = false;
  }
  document.getElementById("cardRankField").value = "";
}

function computerRequestCardRank() {
  let requestedCardRank = computerHand.pickRandom().rank;
  document.getElementById("infoLabel").innerHTML = "It's the computer's turn!";
  document.getElementById("computerText").innerHTML =
    "The computer has requested the card rank " + requestedCardRank;
  return requestedCardRank;
}

function checkPlayerBooks(displayid) {
  let bookRanks = playerHand.getAllBooks();
  if (bookRanks.length !== 0) {
    document.getElementById(displayid).innerHTML =
      "You have book/s for " +
      bookRanks.toString().replaceAll(",", ", ") +
      ". The cards in the book/s are removed from your hand";
    playerHand.removeSameRank(bookRanks);
  }
}

function checkComputerBooks(displayid) {
  let bookRanks = computerHand.getAllBooks();
  if (bookRanks.length !== 0) {
    document.getElementById(displayid).innerHTML =
      "The computer has book/s for " +
      bookRanks.toString().replaceAll(",", ", ") +
      ". The cards in the book/s are removed from its hand";
  }
}

function updatePlayerCardLabel() {
  document.getElementById("playerHand").innerHTML =
    "Your cards are: " + playerHand.showCards();
}

function radioValue(inputName) {
  return document.querySelector(inputName);
}

function fieldValue(fieldName) {
  return document.getElementById(fieldName).value;
}

function show(id) {
  document.getElementById(id).style.display = "block";
}

function hide(id) {
  document.getElementById(id).style.display = "none";
}

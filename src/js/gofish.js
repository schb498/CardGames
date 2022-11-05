import { Deck, Card, CARD_VALUE } from "./deck.js";

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

  cardPool.takeRandomCards(playerHand, 5);
  cardPool.takeRandomCards(computerHand, 5);

  checkPlayerBooks("initialBook");
  checkComputerBooks("computerInitialBook");
  console.log("Computer: " + computerHand.showCards());

  updatePlayerCardLabel();
};

document.getElementById("requestButton").onclick = function () {
  // Checks if inputs are valid
  if (validValueCheck() && suitSelectCheck()) {
    console.log(
      "Requested card: " +
        radioValue('input[name="suit"]:checked').value +
        fieldValue("cardValueField").replace(/\s+/g, "").toUpperCase()
    );
    hide("inputOption");
    let cardName = new Card(
      radioValue('input[name="suit"]:checked').value,
      fieldValue("cardValueField").replace(/\s+/g, "").toUpperCase()
    );
    if (computerHand.find(cardName)) {
      computerHand.take(playerHand, cardName);
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
  let bookValues = playerHand.getAllBooks();
  if (bookValues.length !== 0) {
    document.getElementById("bookCheck").innerHTML =
      "You have books for " +
      bookValues.toString().replaceAll(",", ", ") +
      ". They are removed from your hand";
    playerHand.removeBooks(bookValues);
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

function validValueCheck() {
  let text = fieldValue("cardValueField").replace(/\s+/g, "").toUpperCase();
  // Check if text is a valid card value in the value list
  for (let i = 0; i < CARD_VALUE.length; i++) {
    if (CARD_VALUE[i] === text) {
      document.getElementById("cardValueLabel").innerHTML =
        "Valid card value selected";
      return true;
    }
  }
  document.getElementById("cardValueField").value = "";
  document.getElementById("cardValueLabel").innerHTML =
    "Enter a valid card value:";
  return false;
}

function suitSelectCheck() {
  const checkRadio = radioValue('input[name="suit"]:checked');
  if (checkRadio !== null) {
    document.getElementById("cardSuitLabel").innerHTML =
      checkRadio.getAttribute("id") + " selected";
    return true;
  } else {
    document.getElementById("cardSuitLabel").innerHTML = "No suit selected";
    return false;
  }
}

function resetBoard() {
  document.getElementById("cardSuitLabel").innerHTML = "Select the suit:";
  document.getElementById("cardValueLabel").innerHTML = "Enter the card value:";
  if (radioValue('input[name="suit"]:checked') !== null) {
    radioValue('input[name="suit"]:checked').checked = false;
  }
  document.getElementById("cardValueField").value = "";
}

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
    "Request a card from the computer";
  document.getElementById("nextPlayerButton").innerHTML = "Finish turn";
  isPlayerTurn = false;
}

function computerTurn() {
  // Sets up for computer's turn
  hide("fishArea");
  hide("bookRemove");
  show("computerBox");
  const requestedCard = computerRequestCard();
  if (playerHand.remove(requestedCard)) {
    document.getElementById("requestResult").innerHTML =
      "You give your card to the computer";
    computerHand.add(requestedCard);
    console.log("Computer: " + computerHand.showCards());
    updatePlayerCardLabel();
  } else {
    document.getElementById("requestResult").innerHTML =
      "You do not have the card, the computer fishes for a card";
    cardPool.take(computerHand, cardPool.pickRandom());
    console.log("Computer: " + computerHand.showCards());
  }
  checkComputerBooks("computerBookCheck");
  document.getElementById("nextPlayerButton").innerHTML = "Next turn";
  isPlayerTurn = true;
  show("nextPlayer");
}

function computerRequestCard() {
  let requestCardPool = new Deck();
  for (let i = 0; i < computerHand.cardDeck.length; i++) {
    requestCardPool.remove(computerHand.cardDeck[i]);
  }
  let requestedCard = requestCardPool.pickRandom();
  document.getElementById("infoLabel").innerHTML = "It's the computer's turn!";
  document.getElementById("computerText").innerHTML =
    "The computer has requested the card " + requestedCard.showName();
  return requestedCard;
}

function checkPlayerBooks(displayid) {
  let bookValues = playerHand.getAllBooks();
  if (bookValues.length !== 0) {
    document.getElementById(displayid).innerHTML =
      "You have book/s for " +
      bookValues.toString().replaceAll(",", ", ") +
      ". The cards in the book/s are removed from your hand";
    playerHand.removeBooks(bookValues);
  }
}

function checkComputerBooks(displayid) {
  let bookValues = computerHand.getAllBooks();
  if (bookValues.length !== 0) {
    document.getElementById(displayid).innerHTML =
      "The computer has book/s for " +
      bookValues.toString().replaceAll(",", ", ") +
      ". The cards in the book/s are removed from its hand";
    computerHand.removeBooks(bookValues);
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

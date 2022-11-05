import { Deck, Card, CARD_VALUE } from "./deck.js";

let playerHand;
let botHand;
let cardPool;

document.getElementById("startButton").onclick = function () {
  // Hide pre game area, show game area
  document.getElementById("preGameArea").style.display = "none";
  document.getElementById("gameArea").style.display = "block";

  cardPool = new Deck();
  cardPool.shuffle();

  playerHand = new Deck(cardPool.takeRandomCards(5));
  botHand = new Deck(cardPool.takeRandomCards(5));

  console.log("bot cards: " + botHand.show());

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
    document.getElementById("inputOption").style.display = "none";
    let cardName = new Card(
      radioValue('input[name="suit"]:checked').value,
      fieldValue("cardValueField").replace(/\s+/g, "").toUpperCase()
    );
    if (botHand.find(cardName)) {
      botHand.take(playerHand, cardName);
      updatePlayerCardLabel();
      document.getElementById("infoLabel").innerHTML = "The bot has the card!";
      console.log("bot: " + botHand.show());
      console.log("player: " + playerHand.show());
    } else {
      document.getElementById("infoLabel").innerHTML =
        "The bot does not have the card. GO FISH!";
      document.getElementById("fishArea").style.display = "block";
    }
  }
};

document.getElementById("fishButton").onclick = function () {
  let cardFished = cardPool.pickRandom();
  document.getElementById("fishButton").style.display = "none";
  document.getElementById("fishCard").innerHTML =
    "You fished out: " + cardFished.show();
  cardPool.take(playerHand, cardFished);
  updatePlayerCardLabel();
  document.getElementById("fullSuitRemove").style.display = "block";
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
  let checkRadio = radioValue('input[name="suit"]:checked');
  if (checkRadio != null) {
    document.getElementById("cardSuitLabel").innerHTML =
      checkRadio.getAttribute("id") + " selected";
    return true;
  } else {
    document.getElementById("cardSuitLabel").innerHTML = "No suit selected";
    return false;
  }
}

function updatePlayerCardLabel() {
  document.getElementById("playerHand").innerHTML =
    "Your cards are: " + playerHand.show();
}

function radioValue(inputName) {
  return document.querySelector(inputName);
}

function fieldValue(fieldName) {
  return document.getElementById(fieldName).value;
}

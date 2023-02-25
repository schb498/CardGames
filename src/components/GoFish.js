import Button from "./Button";
import Hand from "./Hand";
import { useState, useEffect, useRef } from "react";
import { Deck } from "../deck";

let playerHand = new Deck([]);
let computerHand = new Deck([]);
let cardPool;
let isPlayerTurn = true;

const GoFish = () => {
  const testRef = useRef(null);

  const [cardRank, setCardRank] = useState("");

  const [preGame, setPreGame] = useState(true);
  const [gameArea, setGameArea] = useState(false);
  const [playerHandLabel, setPlayerHandLabel] = useState("");
  const [initialBook, setInitialBook] = useState("");
  const [computerInitialBook, setComputerInitialBook] = useState("");
  const [infoLabel, setInfoLabel] = useState("");
  const [inputOption, setInputOption] = useState(true);
  const [cardRankLabel, setCardRankLabel] = useState("");
  const [fishButton, setFishButton] = useState(false);
  const [fishCardLabel, setFishCardLabel] = useState("");
  const [bookCheck, setBookCheck] = useState(false);
  const [bookCheckButton, setBookCheckButton] = useState(false);
  const [computerBox, setComputerBox] = useState(false);
  const [computerText, setComputerText] = useState("");
  const [requestResult, setRequestResult] = useState("");
  const [computerBookCheck, setComputerBookCheck] = useState("");
  const [fishCard, setFishCard] = useState(false);
  const [fishArea, setFishArea] = useState(false);
  const [bookRemoveArea, setBookRemoveArea] = useState(false);
  const [nextPlayer, setNextPlayer] = useState(false);
  const [nextPlayerLabel, setNextPlayerLabel] = useState("");

  useEffect(() => {
    // const ref = testRef.current;
    // console.log(ref);
  }, []);

  const onStart = () => {
    setPreGame(false);
    setGameArea(true);
    resetBoard();
    playerTurn();

    cardPool = new Deck();
    cardPool.shuffle();

    cardPool.takeRandomCards(playerHand, 15);
    cardPool.takeRandomCards(computerHand, 15);

    setInitialBook(checkPlayerBooks());
    setComputerInitialBook(checkComputerBooks());
    console.log("Computer: " + computerHand.showCards());
    console.log("player: " + playerHand.showCards());

    updatePlayerCardLabel();
  };

  // OnClick functions

  const onRequest = () => {
    if (validRankCheck()) {
      console.log("Requested card rank: " + cardRank);
      setInputOption(false);
      if (computerHand.findRank(cardRank)) {
        computerHand.takeAll(playerHand, cardRank);
        updatePlayerCardLabel();
        document.getElementById("infoLabel").innerHTML =
          "The Computer has the card(s)! You take the card(s) from the computer";
        setBookRemoveArea(true);
        console.log("Computer: " + computerHand.showCards());
        console.log("player: " + playerHand.showCards());
      } else {
        document.getElementById("infoLabel").innerHTML =
          "The Computer does not have the card(s). GO FISH!";
        setFishArea(true);
      }
    }
  };

  const onFish = () => {
    let cardFished = cardPool.pickRandom();
    setFishButton(false);
    setFishCard(true);
    setFishCardLabel("You fished out: " + cardFished.showName());
    cardPool.take(playerHand, cardFished);
    updatePlayerCardLabel();
    setBookRemoveArea(true);
  };

  const onBookCheck = () => {
    setBookCheckButton(false);
    setBookCheck(true);
    let bookRanks = playerHand.getAllBooks();
    if (bookRanks.length !== 0) {
      setBookCheck(
        "You have books for " +
          bookRanks.toString().replaceAll(",", ", ") +
          ". They are removed from your hand"
      );
      playerHand.removeSameRank(bookRanks);
      updatePlayerCardLabel();
    } else {
      setBookCheck("You have no books, no cards were removed");
    }
    setNextPlayer(true);
  };

  const onNextPlayer = () => {
    resetBoard();
    if (!isPlayerTurn) {
      computerTurn();
    } else {
      playerTurn();
    }
  };

  // Other functions

  const playerTurn = () => {
    //setInfoLabel(true);
    setInputOption(true);
    setBookCheckButton(true);
    setFishButton(true);

    setBookCheck(false);
    setComputerBox(false);
    setFishCard(false);
    setFishArea(false);
    setBookRemoveArea(false);
    setNextPlayer(false);

    setInfoLabel("Request to the computer a card rank for a card in your hand");
    setNextPlayerLabel("Finish turn");
    isPlayerTurn = false;
  };

  const computerTurn = () => {
    // Sets up for computer's turn
    setFishArea(false);
    setBookRemoveArea(false);
    setComputerBox(true);

    const requestedCardRank = [computerRequestCardRank()];
    let cardsRemoved = playerHand.removeSameRank(requestedCardRank);
    if (cardsRemoved.length > 0) {
      setRequestResult(
        "You give your card/s with the same rank to the computer"
      );
      for (let i = 0; i < cardsRemoved.length; i++) {
        computerHand.add(cardsRemoved[i]);
      }
      updatePlayerCardLabel();
    } else {
      setRequestResult(
        "You do not have the card, the computer fishes for a card"
      );
      cardPool.take(computerHand, cardPool.pickRandom());
    }
    setComputerBookCheck(checkComputerBooks());
    console.log("Computer: " + computerHand.showCards());
    console.log("player: " + playerHand.showCards());
    setNextPlayerLabel("Next turn");
    isPlayerTurn = true;

    setNextPlayer(true);
  };

  const validRankCheck = () => {
    //let text = fieldValue("cardRankField").replace(/\s+/g, "").toUpperCase();
    setCardRank(cardRank.replace(/\s+/g, "").toUpperCase());
    // Check if text is a valid card rank in player's hand
    for (let i = 0; i < playerHand.cardDeck.length; i++) {
      if (playerHand.cardDeck[i].rank === cardRank) {
        document.getElementById("cardRankLabel").innerHTML =
          "Valid card rank selected";
        return true;
      }
    }
    setCardRank("");
    document.getElementById("cardRankLabel").innerHTML =
      "Please enter a valid card rank:";
    return false;
  };

  // const suitSelectCheck = () => {};

  const resetBoard = () => {
    // FUNCTION may be moved into playerTurn() somehow

    // Add "Select the suit" for suit choosing mode
    setCardRankLabel("Enter the card value:");
    // if (radioValue('input[name="suit"]:checked') !== null) {
    //   radioValue('input[name="suit"]:checked').checked = false;
    // }
    setCardRank("");
  };

  const computerRequestCardRank = () => {
    let requestedCardRank = computerHand.pickRandom().rank;
    setInfoLabel("It's the computer's turn!");
    setComputerText(
      "The computer has requested the card rank " + requestedCardRank
    );
    return requestedCardRank;
  };

  const checkPlayerBooks = () => {
    // very similar code used in onBookCheck()
    let bookRanks = playerHand.getAllBooks();
    if (bookRanks.length !== 0) {
      playerHand.removeSameRank(bookRanks);
      return (
        "You have book/s for " +
        bookRanks.toString().replaceAll(",", ", ") +
        ". The cards in the book/s are removed from your hand"
      );
    }
  };

  const checkComputerBooks = () => {
    let bookRanks = computerHand.getAllBooks();
    if (bookRanks.length !== 0) {
      return (
        "The computer has book/s for " +
        bookRanks.toString().replaceAll(",", ", ") +
        ". The cards in the book/s are removed from its hand"
      );
    }
  };

  const updatePlayerCardLabel = () => {
    setPlayerHandLabel("Your cards are: " + playerHand.showCards());
  };

  return (
    <>
      <h1>Go Fish Game</h1>
      <h1>Welcome to Go Fish</h1>
      <h2>Click 'START' to begin the game</h2>

      {preGame && (
        <div id="preGame">
          <h1 ref={testRef}>Test Ref</h1>
          <Button
            color={"lightblue"}
            text={"START"}
            onClick={() => onStart()}
          />
        </div>
      )}

      {gameArea && (
        <div id="gameArea">
          <h1 id="playerHand">{playerHandLabel}</h1>
          <h2 id="initialBook">{initialBook}</h2>
          <h2 id="computerInitialBook">{computerInitialBook}</h2>
          <h2 id="infoLabel">{infoLabel}</h2>

          {inputOption && (
            <div id="inputOption">
              <h2 id="cardRankLabel">{cardRankLabel}</h2>
              <input
                value={cardRank}
                onChange={(e) => setCardRank(e.target.value)}
                type="text"
              />
              <Button
                color={"lime"}
                text={"Request"}
                onClick={() => onRequest()}
              />
            </div>
          )}

          {fishArea && (
            <div id="fishArea">
              {fishButton && (
                <Button
                  color={"lightblue"}
                  text={"GO FISH"}
                  onClick={() => onFish()}
                />
              )}
              {fishCard && <h2 id="fishCard">{fishCardLabel}</h2>}
            </div>
          )}

          {bookRemoveArea && (
            <div id="bookRemove">
              {bookCheckButton && (
                <Button
                  color={"red"}
                  text={"Check Book"}
                  onClick={() => onBookCheck()}
                />
              )}
              <h2 id="bookCheck">{bookCheck}</h2>
            </div>
          )}

          {computerBox && (
            <div id="computerBox">
              <h2 id="computerText">{computerText}</h2>
              <h2 id="requestResult">{requestResult}</h2>
              <h2 id="computerBookCheck">{computerBookCheck}</h2>
            </div>
          )}

          {nextPlayer && (
            <div id="nextPlayer">
              <Button
                color={"yellow"}
                text={nextPlayerLabel}
                onClick={() => onNextPlayer()}
              />
            </div>
          )}
        </div>
      )}

      <Hand cards={playerHand.getCardValues()} />
    </>
  );
};

export default GoFish;

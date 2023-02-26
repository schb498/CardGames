import Button from "./Button";
import Hand from "./Hand";
import { useState, useEffect, useRef } from "react";
import { Deck } from "../deck";

let playerHand = new Deck([]);
let computerHand = new Deck([]);
let cardPool;
let isPlayerTurn = true;

const GoFish = () => {
  const [cardRank, setCardRank] = useState("");

  const [preGame, setPreGame] = useState(true);

  const [gameArea, setGameArea] = useState(false);
  const [initialBook, setInitialBook] = useState("");
  const [computerInitialBook, setComputerInitialBook] = useState("");
  const [infoLabel, setInfoLabel] = useState("");
  const [inputOption, setInputOption] = useState(true);
  const [cardRankLabel, setCardRankLabel] = useState("");

  const [bookCheckArea, setBookCheckArea] = useState(false);
  const [bookCheck, setBookCheck] = useState(false);
  const [bookCheckButton, setBookCheckButton] = useState(false);

  const [fishArea, setFishArea] = useState(false);
  const [fishButton, setFishButton] = useState(false);
  const [fishCardLabel, setFishCardLabel] = useState("");

  const [computerBox, setComputerBox] = useState(false);
  const [computerText, setComputerText] = useState("");
  const [requestResult, setRequestResult] = useState("");
  const [computerBookCheck, setComputerBookCheck] = useState("");

  const [nextPlayer, setNextPlayer] = useState(false);
  const [nextPlayerLabel, setNextPlayerLabel] = useState("");

  const [gameResults, setGameResults] = useState(false);

  // useEffect(() => {}, []);

  const onStart = () => {
    setPreGame(false);
    setGameArea(true);
    playerTurn();

    cardPool = new Deck();
    cardPool.shuffle();

    cardPool.takeRandomCards(playerHand, 15);
    cardPool.takeRandomCards(computerHand, 15);

    setInitialBook(checkPlayerBooks());
    setComputerInitialBook(checkComputerBooks());

    console.log("Computer: " + computerHand.showCards());
    console.log("player: " + playerHand.showCards());
  };

  // OnClick functions

  const onRequest = () => {
    setInitialBook("");
    setComputerInitialBook("");
    if (validRankCheck()) {
      console.log("Requested card rank: " + cardRank);
      setInputOption(false);
      // Check if computer has any cards of the same rank
      if (computerHand.findRank(cardRank)) {
        computerHand.takeAll(playerHand, cardRank);
        setInfoLabel(
          "The Computer has the card(s)! You take the card(s) from the computer"
        );
        setBookCheckArea(true);
        console.log("Computer: " + computerHand.showCards());
        console.log("player: " + playerHand.showCards());
      } else {
        setInfoLabel("The Computer does not have the card(s). GO FISH!");
        setFishCardLabel("");
        setFishArea(true);
      }
    }
  };

  const onFish = () => {
    let cardFished = cardPool.pickRandom();
    setFishButton(false);
    setFishCardLabel("You fished out: " + cardFished.showName());
    cardPool.take(playerHand, cardFished);
    setBookCheck("");
    setBookCheckArea(true);
  };

  const onPlayerBookCheck = () => {
    setBookCheckButton(false);
    setBookCheck(checkPlayerBooks());
    setNextPlayer(true);
  };

  const onNextPlayer = () => {
    isPlayerTurn ? playerTurn() : computerTurn();
  };

  const onEndGame = () => {
    console.log("Game End");
    setGameArea(false);
    setGameResults(true);
  };

  // Other functions

  const playerTurn = () => {
    setInputOption(true);
    setBookCheckButton(true);
    setFishButton(true);

    setComputerBox(false);
    setFishArea(false);
    setBookCheckArea(false);
    setNextPlayer(false);

    setCardRankLabel("Enter the card value:");
    // if (radioValue('input[name="suit"]:checked') !== null) {
    //   radioValue('input[name="suit"]:checked').checked = false;
    // }
    setCardRank("");

    setInfoLabel("Request to the computer a card rank for a card in your hand");

    setNextPlayerLabel("Finish turn");
    isPlayerTurn = false;
  };

  const computerTurn = () => {
    // Sets up for computer's turn
    setFishArea(false);
    setBookCheckArea(false);
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
    } else {
      setRequestResult(
        "You do not have the card, the computer fishes for a card"
      );
      cardPool.take(computerHand, cardPool.pickRandom());
    }
    setComputerBookCheck(checkComputerBooks());
    console.log("Computer: " + computerHand.showCards());
    console.log("player: " + playerHand.showCards());

    isPlayerTurn = true;
    setNextPlayerLabel("Next turn");
    setNextPlayer(true);
  };

  const validRankCheck = () => {
    setCardRank(cardRank.replace(/\s+/g, "").toUpperCase());
    // Check if text is a valid card rank in player's hand
    for (let i = 0; i < playerHand.cardDeck.length; i++) {
      if (playerHand.cardDeck[i].rank === cardRank) {
        setCardRankLabel("Valid card rank selected");
        return true;
      }
    }
    setCardRank("");
    setCardRankLabel("Please enter a valid card rank:");
    return false;
  };

  // const suitSelectCheck = () => {};

  const computerRequestCardRank = () => {
    let requestedCardRank = computerHand.pickRandom().rank;
    setInfoLabel("It's the computer's turn!");
    setComputerText(
      "The computer has requested the card rank " + requestedCardRank
    );
    return requestedCardRank;
  };

  const checkPlayerBooks = () => {
    // very similar code used in onPlayerBookCheck()
    let bookRanks = playerHand.getAllBooks();
    if (bookRanks.length !== 0) {
      playerHand.removeSameRank(bookRanks);
      return (
        "You have a book for " +
        bookRanks.toString().replaceAll(",", ", ") +
        ". The cards in the book are removed from your hand"
      );
    } else {
      return "You have no book, no cards were removed";
    }
  };

  const checkComputerBooks = () => {
    let bookRanks = computerHand.getAllBooks();
    if (bookRanks.length !== 0) {
      computerHand.removeSameRank(bookRanks);
      return (
        "The computer has a book for " +
        bookRanks.toString().replaceAll(",", ", ") +
        ". The cards in the book are removed from its hand"
      );
    } else {
      return "The computer does not have a book";
    }
  };

  return (
    <>
      <h1>Go Fish Game</h1>
      <br></br>

      {preGame && (
        <>
          <h1>Welcome to Go Fish</h1>
          <h2>Click 'START' to begin the game</h2>
          <div id="preGame">
            <Button
              color={"lightblue"}
              text={"START"}
              onClick={() => onStart()}
            />
          </div>
        </>
      )}

      {gameArea && (
        <div id="gameArea">
          <Hand cards={playerHand.getCardValues()} />
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
                size="10"
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
              <h2 id="fishCardLabel">{fishCardLabel}</h2>
              {fishButton && (
                <Button
                  color={"turquoise"}
                  text={"GO FISH"}
                  onClick={() => onFish()}
                />
              )}
            </div>
          )}

          {bookCheckArea && (
            <div id="bookRemove">
              <h2 id="bookCheck">{bookCheck}</h2>
              {bookCheckButton && (
                <Button
                  color={"bisque"}
                  text={"Check Book"}
                  onClick={() => onPlayerBookCheck()}
                />
              )}
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

          <Button color={"red"} text={"End Game"} onClick={() => onEndGame()} />
        </div>
      )}

      {gameResults && <h1>You Won!</h1>}
    </>
  );
};

export default GoFish;

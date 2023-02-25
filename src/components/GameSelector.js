import Button from "./Button";

const GameSelector = () => {
  const onfish = () => {};
  return (
    <div>
      <h2>Choose the card game you want to play</h2>
      <Button color={"lightblue"} text={"Go Fish"} onClick={onfish()} />
    </div>
  );
};

export default GameSelector;

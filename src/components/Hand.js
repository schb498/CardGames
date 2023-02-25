import Card from "./Card";

const Hand = ({ cards }) => {
  const hand = [];
  cards.forEach((card, i) => {
    hand.push(
      <div className="test2" key={i}>
        <Card name={card} scale={0.3} color={"green"} />
      </div>
    );
  });
  return <div className="test">{hand}</div>;
};

export default Hand;

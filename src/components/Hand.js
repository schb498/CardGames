import Card from "./Card";

const Hand = ({ cards }) => {
  const hand = [];
  cards.forEach((card, i) => {
    hand.push(
      <div className="card-element" key={i}>
        <Card name={card} scale={0.3} color={"green"} />
      </div>
    );
  });
  return <div className="card-row">{hand}</div>;
};

export default Hand;

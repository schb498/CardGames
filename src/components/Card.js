import PropTypes from "prop-types";

const Card = ({ name, scale, color }) => {
  const cardStyle = {
    width: 150,
    height: 210,
    borderRadius: 15,
    fontSize: 75,
    paddingTop: 52,
    scale: scale,
  };
  Object.keys(cardStyle).forEach((key) => {
    cardStyle[key] *= scale;
  });

  return (
    <div className="card" color={color} style={cardStyle}>
      {name}
    </div>
  );
};

Card.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Card;

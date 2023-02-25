import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Button = ({ color, text, onClick, as: Component = "button" }) => {
  return (
    <Component
      onClick={onClick}
      className="btn"
      style={{ backgroundColor: color }}
    >
      <Link to={"/goFishGame"}>{text}</Link>
    </Component>
  );
};

Button.defaultProps = {
  color: "lime",
};

// Sets variable types
Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

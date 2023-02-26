import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Button = ({ color, text, onClick, as: Component = "button" }) => {
  return (
    <Component
      onClick={onClick}
      className="button"
      style={{ backgroundColor: color }}
    >
      <Link to={"/goFishGame"}>{text}</Link>
    </Component>
  );
};

// Sets variable types
Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

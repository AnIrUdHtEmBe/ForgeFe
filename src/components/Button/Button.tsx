import { Link } from "react-router-dom";
import "./styles.css";

interface ButtonProps {
  text: string;
  link?: string;
  onClick?: () => void;
}

const Button = (ButtonProps: ButtonProps) => {
  const content = (
    <div className="button-container" onClick={ButtonProps.onClick}>
      <p className="button-text">{ButtonProps.text}</p>
    </div>
  );

  return ButtonProps.link ? (
    <Link to={ButtonProps.link} className="button-link">
      {content}
    </Link>
  ) : (
    content
  );
};

export default Button;

import { FaRegUserCircle } from "react-icons/fa";
import "./styles.css";
import { DEFAULT_ICON_SIZE } from "../../default";

const Nav = () => {
  return (
    <div className="top-nav-container">
      <div className="nav-left">
        <div className="--logo">
          <img src="Play_Logo.svg" alt="Logo" />
        </div>
        <div className="--center">
          <span>Sarjapur</span>
        </div>
      </div>

      <div className="nav-right">
        <span className="--username">
          {localStorage?.getItem("userName")?.slice(1).slice(0, -1)}
        </span>
        <div className="--icon">
          <FaRegUserCircle size={DEFAULT_ICON_SIZE} />
        </div>
      </div>
    </div>
  );
};

export default Nav;

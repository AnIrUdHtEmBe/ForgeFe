import { FaRegUserCircle } from "react-icons/fa";
import "./styles.css";
import { DEFAULT_ICON_SIZE } from "../../default";
import { useLocation, useNavigate } from "react-router-dom";

const Nav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  console.log(currentPath);
  return (
    <div className="top-nav-container">
      <div className="nav-left">
        <div
          className="--logo"
          onClick={() => {
            if (currentPath !== "/") {
              navigate("/");
            }
          }}
        >
          <img src="Play_Logo.svg" alt="Logo" />
        </div>
        <div className="--center">
          <span>Sarjapur</span>
        </div>
      </div>

      {currentPath === "/" ? (
        ""
      ) : (
        <div className="nav-right">
          <span className="--username">
            {localStorage?.getItem("userName")?.slice(1).slice(0, -1)}
          </span>
          <div className="--icon">
            <FaRegUserCircle size={DEFAULT_ICON_SIZE} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;

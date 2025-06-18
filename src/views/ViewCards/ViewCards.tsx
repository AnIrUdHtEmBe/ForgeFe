import { useLocation } from "react-router-dom";
import PlayerInfoCard from "../../components/PlayerCard/PlayerCard";
import "./styles.css";
import { IoIosArrowBack } from "react-icons/io";
import { DEFAULT_ICON_SIZE } from "../../default";
import type { t_game } from "../../types/games";

const ViewCards = () => {
  const location = useLocation();
  const { selectedDate, cardInfo } = location.state;
  console.log(selectedDate, cardInfo);
  if (!selectedDate || !cardInfo) {
    return <span>Invalid data</span>;
  }

  const backClickHandler = () => {
    window.history.back();
  };

  return (
    <div className="view-cards-container">
      <div className="--back" onClick={backClickHandler}>
        <IoIosArrowBack size={DEFAULT_ICON_SIZE} />
      </div>
      <div className="view-cards-top-heading">
        <span className="--date">
         {selectedDate.toLocaleDateString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
        </span>
        <span className="--day">
          {/* figure out day by date */}
         {selectedDate.toLocaleDateString("en-US", {
						weekday: "long",
					})}
        </span>
      </div>

      <div className="view-card-content-container">
        {/* replace this with card info */}
        {cardInfo.map((games : t_game, i : number) => {
          return <PlayerInfoCard startTime={new Date(games.bookingDetails.st_unix *1000)} endTime={new Date(games.bookingDetails.et_unix *1000)} showLevel={games.difficultyLevel}  game={games} showBtn key={i} />;
        })}
      </div>
    </div>
  );
};

export default ViewCards;

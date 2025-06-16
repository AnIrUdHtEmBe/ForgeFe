import { useEffect, useState, type JSX } from "react";
import { SPORTS } from "../../default";
import "./styles.css";

interface SportStripProps {
  activeSport: { name: string; icon?: JSX.Element };
  changeActiveSport: (newSport: string) => void;
}



const SportStrip = (props: SportStripProps) => {

	let [sportName , setSportName] = useState<string>("All");

	useEffect(() => {
    const name = props.activeSport.name;
    if (name === "All") setSportName("All");
    else if (name === "football") setSportName("FootBall");
    else if (name === "Tennis") setSportName("Tennis");
    else if (name === "Badminton") setSportName("Badminton");
    else setSportName("Sports"); // fallback
  }, [props.activeSport.name]);

	
  return (
    <div className="sport-strip-container">
      <div className="sport-strip-current-filter">
        <span>
          {props.activeSport.icon || sportName}
        </span>
      </div>
      <div className="sport-strip-sports-filter">
        {SPORTS.map((sport, i) => {
          return (
            <div
              className={`--sport ${
                props.activeSport.name === sport.name ? "--bookSportActive" : ""
              }`}
              key={i}
              onClick={() => props.changeActiveSport(sport.name)}
            >
              {sport.icon || sport.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SportStrip;

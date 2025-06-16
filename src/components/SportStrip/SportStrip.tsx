import { useEffect, useState, type JSX } from "react";
import { SPORTS } from "../../default";
import "./styles.css";
import { HttpStatusCode, type AxiosResponse } from "axios";
import type { t_sport } from "../../types/sports";
import { enqueueSnackbar } from "notistack";
import { getSports } from "../../api/sports";

interface SportStripProps {
  activeSport: { name: string; icon?: JSX.Element };
  changeActiveSport: (newSport: string) => void;
  category: string;
}

const SportStrip = (props: SportStripProps) => {
  let [sports, setSports] = useState<t_sport[]>([]);  

  const getAllSports = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data);
        setSports(response.data);
      } else {
        enqueueSnackbar({
          message: "Failed to fetch the data!",
          autoHideDuration: 3000,
          variant: "error",
        });
      }
    };

    const onReject = (e) => {
      console.log(e);
      enqueueSnackbar({
        message: "Failed to fetch the data!",
        autoHideDuration: 3000,
        variant: "error",
      });
    };

    getSports(onAccept, onReject, props.category);
  };

  useEffect(() => {
    getAllSports();
  }, []);

  return (
    <div className="sport-strip-container">
      <div className="sport-strip-current-filter">
        <span>{props.activeSport.name || props.activeSport.icon}</span>
      </div>
      <div className="sport-strip-sports-filter">
        {sports.map((sport, i) => {
          return (
            <div
              className={`--sport ${
                props.activeSport.name === sport.name ? "--bookSportActive" : ""
              }`}
              key={i}
              onClick={() => props.changeActiveSport(sport.name)}
            >
              {sport.name || sport.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SportStrip;

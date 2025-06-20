import { useEffect, useState, type JSX } from "react";
import "./styles.css";
import { HttpStatusCode, type AxiosResponse } from "axios";
import type { t_sport } from "../../types/sports";
import { enqueueSnackbar } from "notistack";
import { getSports } from "../../api/sports";
import { E_PageState } from "../../types/state";
import { FullScreenLoader } from "../Loader/CustomLoader";

interface SportStripProps {
  activeSport: { name: string; icon?: JSX.Element };
  changeActiveSport: (newSport: t_sport) => void;
  category: string;
}

const SportStrip = (props: SportStripProps) => {
  const [sports, setSports] = useState<t_sport[]>([]);  
  const [pageState, setPageState] = useState(E_PageState.Unknown);

  const getAllSports = () => {

    setPageState(E_PageState.Loading);
    const onAccept = (response: AxiosResponse) => {
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data);
        setSports(response.data);

        if (response.data.length > 0) {
          props.changeActiveSport(response.data[0]);
        }

        setPageState(E_PageState.Accepted);
      } else {
        setPageState(E_PageState.Rejected);
        enqueueSnackbar({
          message: "Failed to fetch the data!",
          autoHideDuration: 3000,
          variant: "error",
        });
      }
    };

    const onReject = (e :unknown) => {
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

  if (pageState === E_PageState.Loading) {
    return <FullScreenLoader />;
  }

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
              onClick={() => props.changeActiveSport(sport)}
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

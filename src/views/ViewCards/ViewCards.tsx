import { useLocation } from "react-router-dom";
import PlayerInfoCard from "../../components/PlayerCard/PlayerCard";
import "./styles.css";
import { IoIosArrowBack } from "react-icons/io";
import { DEFAULT_ICON_SIZE } from "../../default";
import type { t_game } from "../../types/games";
import type { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { getSports } from "../../api/sports";
import { getGamesByDateAndSports } from "../../api/games";
import type { t_sport } from "../../types/sports";

const ViewCards = () => {
  const location = useLocation();

  const [sports, setSports] = useState<t_sport[]>([]);
  const [games, setGames] = useState<t_game[]>([]);
  console.log(games);

  const { selectedDate, category , session} = location.state;

  console.log(session)
  const backClickHandler = () => {
    window.history.back();
  };

  const getSportsByCategory = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
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

    const onReject = (error: unknown) => {
      console.error("Error fetching games:", error);
      enqueueSnackbar({
        message: "Failed to fetch the data!",
        autoHideDuration: 3000,
        variant: "error",
      });
    };
    getSports(onAccept, onReject, category);
  };

  useEffect(() => {
    getSportsByCategory();
  }, []);

  useEffect(() => {
    if (sports.length > 0) {
      sports.forEach((sport: t_sport) => {
        console.log("Sport ID  :", sport.sportId);
        fetchGames(sport.sportId);
      });
    }
  }, [sports]);

  const fetchGames = (sportId: string) => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        console.log(response.data);
        setGames((prev) => [...prev, ...response.data]);
      } else {
        enqueueSnackbar({
          message: "Failed to fetch the data!",
          autoHideDuration: 3000,
          variant: "error",
        });
      }
    };
    const onReject = (error: unknown) => {
      console.error("Error fetching games:", error);
    };

    getGamesByDateAndSports(onAccept, onReject, selectedDate, sportId);
  };

  useEffect(()=>{
    console.log(games)
  },[games])
  const date = new Date(selectedDate);

  return (
    <div className="view-cards-container">
      <div className="--back" onClick={backClickHandler}>
        <IoIosArrowBack size={DEFAULT_ICON_SIZE} />
      </div>
      <div className="view-cards-top-heading">
        <span className="--date">
          {date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="--day">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </span>
      </div>

      <div className="view-card-content-container">
        {games.length === 0 && (
          <div className="no-games-found">
            <span>No games found for the selected date.</span>
          </div>
        )}
        {games.map((games: t_game, i: number) => {
          return (
            <PlayerInfoCard
              startTime={new Date(games.bookingDetails.st_unix * 1000)}
              endTime={new Date(games.bookingDetails.et_unix * 1000)}
              showLevel={games.difficultyLevel}
              game={games}
              showBtn
              key={i}
              session={session}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ViewCards;

import { useEffect, useState } from "react";
import CalendarStrip from "../../components/Calendar/Calendar";
import SportStrip from "../../components/SportStrip/SportStrip";
import "./styles.css";
import { SPORTS, UNKNOWN_SPORTS_ICON } from "../../default";
import { useNavigate } from "react-router-dom";
import E_Routes from "../../types/routes";
import CourtStrip from "../../components/CourtStrip/CourtStrip";
import type { t_sport } from "../../types/sports";
import type { Axios, AxiosResponse } from "axios";
import type { t_game } from "../../types/games";
import { enqueueSnackbar } from "notistack";
import { getGamesByDateAndSports } from "../../api/games";

const BookSport = () => {
  const [activeDate, setActiveDate] = useState<string>(
    new Date().toISOString()
  );
  const [selectedSport, setSelectedSport] = useState<t_sport>();
  const [games, setGames] = useState<t_game[]>();

  const [filters, setFilters] = useState({
    date: activeDate,
    sport: "Sports",
    court: "ALL",
  });

  console.log(filters);

  const navigate = useNavigate();
  const fetchGames = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        console.log(response.data);
        setGames(response.data);
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

    getGamesByDateAndSports(
      onAccept,
      onReject,
      filters.date,
      filters.sport,
      filters.court === "ALL" ? undefined : filters.court
    );
  };

  useEffect(() => {
    fetchGames();
  }, [filters]);

  useEffect(() => {
    const shouldRefetch = sessionStorage.getItem("shouldRefetchGames");
  
    if (shouldRefetch === "true") {
      fetchGames(); // Re-fetch
      sessionStorage.removeItem("shouldRefetchGames"); // Clean up
    }
  }, []);

  console.log("games", games);

  const clickHandler = () => {
		const dateObj = new Date(filters.date);
    //fill these fields
    navigate(E_Routes.viewCards, {
      state: { selectedDate: dateObj, cardInfo: games },
    });
  };

  const handleSportChange = (newSport: t_sport) => {
    setFilters((prev) => ({ ...prev, sport: newSport.name }));
    setSelectedSport(newSport);
  };

  const handleDateChange = (newDate: string) => {
    setActiveDate(newDate);
    setFilters((prev) => ({ ...prev, date: newDate }));
  };

  const handleCourtChange = (newCourt: string) => {
    setFilters((prev) => ({ ...prev, court: newCourt }));
  };

  return (
    <div className="book-sport-container">
      <div className="book-sport-top-calendar">
        <div className="--calendar">
          <CalendarStrip
            activeDate={activeDate}
            onDateChangeHandler={handleDateChange}
          />
        </div>
        <div className="--sport">
          <SportStrip
            activeSport={{ name: filters.sport }}
            changeActiveSport={handleSportChange}
            category="SPORTS"
          />
        </div>

        <div className="--calendar">
          <CourtStrip
            activeCourt={{ name: filters.court }}
            changeActiveCourt={handleCourtChange}
            selectedSport={selectedSport}
          />
        </div>
      </div>
      <div className="book-sport-content-container">
        {games && games.length > 0 ? (
          <div className="book-sport-slot-container">
            <div className=" book-sport-slot-header">
              <h3>The available Games For {activeDate}</h3>
            </div>
            {games.map((game, i) => {
              return (
                <div key={i} className="--game-slot">
                  <div className="--time">
                    <span>
                      {new Date(game.bookingDetails.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="--sport-name">
                    {game.sport || UNKNOWN_SPORTS_ICON}
                  </div>
                  <div className="--slots"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-games-message">
            <h2>No games are available for the Selected Date And Sport</h2>
          </div>
        )}

        {games && games.length > 0 && (
          <div className="book-button-container">
            <button className="book-button" onClick={clickHandler}>
              Book
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSport;

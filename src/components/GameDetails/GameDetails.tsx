import React, { use, useEffect, useState } from "react";
import "./styles.css";
import { IoIosArrowBack } from "react-icons/io";
import { DEFAULT_ICON_SIZE } from "../../default";
import { useLocation } from "react-router-dom";
import type { AxiosResponse } from "axios";
import { getGamesById } from "../../api/games";

const players = [
  {
    name: "Aman",
    role: "Host",
    level: "Professional",
    rating: 4.5,
    image: "/user1.jpg",
  },
  { name: "Sidharth", level: "Beginner", rating: 4.5, image: "/user2.jpg" },
  { name: "James", level: "Beginner", rating: 4.5, image: "/user3.jpg" },
  { name: "Zaire", level: "Beginner", rating: 4.5, image: "/user4.jpg" },
  { name: "Phillip", level: "Beginner", rating: 4.5, image: "/user5.jpg" },
  { name: "Alfredo", level: "Beginner", rating: 4.5, image: "/user6.jpg" },
];

const GameDetails = () => {
  const location = useLocation();
  const [gameDetails, setGameDetails] = useState();

  const { gameId } = location.state;

  const getGameById = () => {
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        console.log(response.data);
        setGameDetails(response.data);
      } else {
        console.error("Failed to fetch game data");
      }
    };

    const onReject = (error: unknown) => {
      console.error("Error fetching game data:", error);
    };

    getGamesById(onAccept, onReject, gameId);
  };

  useEffect(() => {
    getGameById();
  }, []);

  const backClickHandler = () => {
    window.history.back();
  };

  console.log(gameDetails);

  return (
    <div className="game-container">
      {/* Header */}
      <div className="header">
        <IoIosArrowBack size={DEFAULT_ICON_SIZE} onClick={backClickHandler} />
        <h2>{gameDetails?.sport}</h2>
      </div>

      {/* Date/Time */}
      <div className="date-box">
        <p className="date">
          {new Date(gameDetails?.startTime).toLocaleString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="time">
          {new Date(gameDetails?.startTime).toLocaleString("en-IN", {
            weekday: "long",
          })}
        </p>
      </div>

      {/* Players */}
      <div className="players-section">
        <div className="players-header">
          <h3>Players</h3>
          <span className="session-type-1">{gameDetails?.difficultyLevel}</span>
        </div>
        <div className="players-grid">
          {gameDetails?.scheduledPlayersDetails?.map((player, i) => (
            <div key={i} className="player-card">
              <img src={player.photo} />
              <p className="player-name">{player.name}</p>
              <div className="badges">
                <span className="badge host">{i === 0 ? "Host" : "Player"}</span>
              </div>
              <p className="rating">⭐ {5}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;

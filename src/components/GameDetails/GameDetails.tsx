import React, { use, useEffect, useState } from "react";
import "./styles.css";
import { IoIosArrowBack } from "react-icons/io";
import { DEFAULT_ICON_SIZE } from "../../default";
import { useLocation } from "react-router-dom";
import type { AxiosResponse } from "axios";
import { getGamesById } from "../../api/games";
import { enqueueSnackbar } from "notistack";
import { getAllImages } from "../../api/images";
import { getBookingById } from "../../api/booking";
import { convertUnixToLocalTime } from "../../utils/date";

const GameDetails = () => {
  const location = useLocation();
  const [gameDetails, setGameDetails] = useState();
  const [bookDetails,setBookDetails]=useState();
  const [images, setImages] = useState({});
  console.log(images);

  const { gameId } = location.state;

 const getAllImg = () => {
  const onAccept = (response: AxiosResponse) => {
    if (response.status === 200) {
      console.log("getAllImages response:", response.data);
      
      // Transform the response to extract photoThumbUrl for each user
      const imageMap = {};
      Object.keys(response.data).forEach(userId => {
        if (response.data[userId]?.photoThumbUrl) {
          imageMap[userId] = response.data[userId].photoThumbUrl;
        }
      });
      
      setImages(imageMap);
      console.log(images, " IMAGES ?????");
      
    } else {
      console.error("Failed to fetch images");
    }
  };

  const onReject = (error: unknown) => {
    console.error("Error fetching images:", error);
  };

  console.log("Fetching images for players:", gameDetails?.scheduledPlayers);

  getAllImages(
    onAccept,
    onReject,
    gameDetails?.scheduledPlayers.length > 0
      ? gameDetails?.scheduledPlayers
      : []
  );
};

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
  const getBookById=(bookId)=>{
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        console.log(response.data);
        setBookDetails(response.data);
      } else {
        console.error("Failed to fetch game data");
      }
    };

    const onReject = (error: unknown) => {
      console.error("Error fetching game data:", error);
    };
    getBookingById(onAccept,onReject,bookId)
  }
  useEffect(()=>{
    
    getBookById(gameDetails?.bookingId)
  },[gameDetails])
  console.log(bookDetails,"kpojjojoi")

  const backClickHandler = () => {
    window.history.back();
  };

  console.log(gameDetails,"gameDetails general?");

  useEffect(() => {
    if (gameDetails !== null && gameDetails !== undefined) {
      getAllImg();
    }
  }, [gameDetails]);

  return (
    <div className="game-container">
      {/* Header */}
      <div className="header">
        <IoIosArrowBack size={DEFAULT_ICON_SIZE} onClick={backClickHandler} />
        <h2>{gameDetails?.sport}</h2>
      </div>

      {/* Date/Time */}
      <div className="datee-box">
        <div className="date-box">
          <p className="date">
            {new Date(bookDetails?.startTime).toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="time">
            {new Date(bookDetails?.startTime).toLocaleString("en-IN", {
              weekday: "long",
            })}
          </p>
        </div>
        <div className="time-box">
          <p className="time">
            {/* {new Date(
              new Date(bookDetails?.startTime).getTime() + 60 * 60 * 1000
            ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <div>-</div>
          <p className="time">
            {new Date(
              new Date(bookDetails?.endTime).getTime() + 60 * 60 * 1000
            ).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })} */}
            {convertUnixToLocalTime(bookDetails?.startTime)}-{convertUnixToLocalTime(bookDetails?.endTime)}
          </p>
        </div>
      </div>

      {/* Players */}
      <div className="players-section">
        <div className="players-header">
          <h3>Players</h3>
          <span className={`session-type-1 ${gameDetails?.difficultyLevel === 'Beginner' ? 'game-bg-beginner' :
                                                gameDetails?.difficultyLevel === 'Intermediate' ? 'game-bg-intermediate' :
                                                    gameDetails?.difficultyLevel === 'Advanced' ? 'game-bg-difficult' : ''
                                            }`}>{gameDetails?.difficultyLevel}</span>
        </div>
        <div className="players-grid">
          {gameDetails?.scheduledPlayersDetails?.map((player, i) => (
            <div key={i} className="player-card">
   {images && images[player.userId] ? (
  <img src={images[player.userId]} alt="Player" />
) : (
  <img src={player.photo || "/default-avatar.png"} alt="Player" />
)}

              <p className="player-name">{player.name}</p>
              <div className="badges">
                <span className="badge host">
                  {i === 0 ? "Host" : "Player"}
                </span>
              </div>
              {/* <p className="rating">⭐ {5}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;

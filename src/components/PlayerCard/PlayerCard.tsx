import "./styles.css";
import PlayerProfileImg from "../../assets/playerProfile.png";
import CustomChip from "../CustomChip/CustomChip";
import Button from "../Button/Button";
import { getFormattedDateTime } from "../../utils/date";
import type { t_game } from "../../types/games";
import { addPlayersToGame } from "../../api/booking";
import { HttpStatusCode, type AxiosResponse } from "axios";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { PopupModal } from "../PopupModal/PopupModal";
import { getGamesByDateAndSports } from "../../api/games";
interface PlayerInfoCardProps {
  game?: t_game;
  showLevel?: string;
  showBtn?: boolean;
  drill?: boolean;
  courtId?: string;
  startTime?: Date;
  endTime?: Date;
  sport?: string;
}

const PlayerInfoCard = (props: PlayerInfoCardProps) => {
  const start = props.startTime;
  const end = props.endTime;
  const game = props.game;

  const [modal, setModal] = useState<boolean>(false);

  console.log("PlayerInfoCard props", game);

  const { dateStr, timeStr } = getFormattedDateTime(start, end);

  const handleBooking = (bookingId: string) => {
    console.log("Booking clicked");
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        setModal(true);
        enqueueSnackbar({
          message: "Successfully joined the game!",
          autoHideDuration: 3000,
          variant: "success",
        });

        // getGamesByDateAndSports();
      } else {
        enqueueSnackbar({
          message: "Failed to join the game!",
          autoHideDuration: 3000,
          variant: "error",
        });
      }
    };

    const onReject = (e: unknown) => {
      console.error("Error joining game:", e);
      enqueueSnackbar({
        message: "Failed to join the game!",
        autoHideDuration: 3000,
        variant: "error",
      });
    };

    addPlayersToGame(onAccept, onReject, bookingId, "USER_JWXJ19"); // Replace "userId" with actual user ID
  };

  const handleCloseModal = () => {
    setModal(false);
  };




  return (
    <div className="player-info-card-container">
      <div className="player-info-start-container">
        <div className="player-info-profile">
          <div className="--img">
            <img src={PlayerProfileImg} />
          </div>
          <div className="--username">
            <span>{game?.hostName}</span>
          </div>
        </div>
        <div className="player-info-date-and-time">
          <span>{dateStr}</span>
          <span>{timeStr}</span>
        </div>
        <div className="player-info-event-info">
          <div className="--game">
            {/* {games[0].icon(20)} */}
            <span>{props.sport}</span>
          </div>
          <div className="--delim">.</div>
          <div className="--side">{/* <span>5 A Side</span> */}</div>
        </div>
      </div>
      <div className="player-info-end-container">
        <div className="player-info-badge-container">
          <CustomChip
            text={
              game &&
              game.maxPlayers != null &&
              game.bookingDetails?.joinedUsers
                ? game.maxPlayers - game.bookingDetails.joinedUsers.length - 1
                : "-"
            }
            showSlots={true}
          />
        </div>
        <div className="player-info-event-location">
          <span>Sarjapur Road, Bangalore</span>
        </div>
        {/* <div
					className="player-info-view-details-button"
					onClick={() => {}}
				>
					<span>View Details</span>
				</div> */}
        {props.showLevel && (
          <div className="player-info-player-level">
            <span>{props.showLevel}</span>
          </div>
        )}
        {props.showBtn && (
          <div className="player-info-bottom-btn">
            <Button
              onClick={() => {
                {
                  game &&
                    game.bookingDetails &&
                    game.bookingDetails.bookingId &&
                    handleBooking(game.bookingDetails.bookingId);
                }
              }}
              text={
                props.game?.bookedBy === "ForgeHub" ? "Join Drill" : "Join Game"
              }
            />
          </div>
        )}
      </div>

      {modal && (
        <PopupModal onClose={handleCloseModal} ></PopupModal>
      )}
    </div>
  );
};

export default PlayerInfoCard;

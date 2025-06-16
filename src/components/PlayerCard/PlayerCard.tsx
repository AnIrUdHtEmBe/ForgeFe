import './styles.css';
import PlayerProfileImg from '../../assets/playerProfile.png';
import CustomChip from '../CustomChip/CustomChip';
import Button from '../Button/Button';

interface PlayerInfoCardProps {
	showLevel?: boolean;
	showBtn?: boolean;
	drill?: boolean;
}

const PlayerInfoCard = (props: PlayerInfoCardProps) => {
	return (
		<div className="player-info-card-container">
			<div className="player-info-start-container">
				<div className="player-info-profile">
					<div className="--img">
						<img src={PlayerProfileImg} />
					</div>
					<div className="--username">
						<span>Sahil</span>
					</div>
				</div>
				<div className="player-info-date-and-time">
					<span>24th Jul, Wednesday </span>
					<span>12:00AM - 01:00PM</span>
				</div>
				<div className="player-info-event-info">
					<div className="--game">
						{/* {games[0].icon(20)} */}
						<span>Football</span>
					</div>
					<div className="--delim">.</div>
					<div className="--side">
						<span>5 A Side</span>
					</div>
				</div>
			</div>
			<div className="player-info-end-container">
				<div className="player-info-badge-container">
					<CustomChip
						text="Booked"
						showSlots={false}
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
						<span>Beginner</span>
					</div>
				)}
				{props.showBtn && (
					<div className="player-info-bottom-btn">
						<Button text={props.drill ? 'Join Drill' : 'Join Game'} />
					</div>
				)}
			</div>
		</div>
	);
};

export default PlayerInfoCard;

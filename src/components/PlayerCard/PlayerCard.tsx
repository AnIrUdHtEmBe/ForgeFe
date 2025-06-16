import './styles.css';
import PlayerProfileImg from '../../assets/playerProfile.png';
import CustomChip from '../CustomChip/CustomChip';
import Button from '../Button/Button';

interface PlayerInfoCardProps {
	showLevel?: boolean;
	showBtn?: boolean;
	drill?: boolean;
	courtId?: string; // optional, if you want to show court info
	startTime?: Date; // optional, if you want to show start time
	endTime?: Date; // optional, if you want to show end time
}



const PlayerInfoCard = (props: PlayerInfoCardProps) => {
	const start = props.startTime
	const end = props.endTime

const ordinal = (d: number) =>
  d + (d > 3 && d < 21 ? 'th' : ['st', 'nd', 'rd'][((d % 10) - 1)] || 'th');

const dateStr = `${ordinal(start.getDate())} ${start.toLocaleString('default', { month: 'short' })}, ${start.toLocaleString('default', { weekday: 'long' })}`;
const timeStr = `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
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
					<span>{dateStr}</span>
					<span>{timeStr}</span>
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

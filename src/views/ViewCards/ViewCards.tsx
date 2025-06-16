import { useLocation } from 'react-router-dom';
import PlayerInfoCard from '../../components/PlayerCard/PlayerCard';
import './styles.css';
import { IoIosArrowBack } from 'react-icons/io';
import { DEFAULT_ICON_SIZE } from '../../default';

const ViewCards = () => {
	const location = useLocation();
	const { selectedDate, cardInfo } = location.state;
	console.log(selectedDate, cardInfo);
	if (!selectedDate || !cardInfo) {
		return <span>Invalid data</span>;
	}

	const backClickHandler = () => {
		window.history.back();
	};

	return (
		<div className="view-cards-container">
			<div
				className="--back"
				onClick={backClickHandler}
			>
				<IoIosArrowBack size={DEFAULT_ICON_SIZE} />
			</div>
			<div className="view-cards-top-heading">
				<span className="--date">
					{/* use the selected date here from the state */}
					28th March 2025
				</span>
				<span className="--day">
					{/* figure out day by date */}
					Wednesday
				</span>
			</div>

			<div className="view-card-content-container">
				{/* replace this with card info */}
				{new Array(3).fill(0).map((_, i) => {
					return (
						<PlayerInfoCard
							drill 
              showBtn
							key={i}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default ViewCards;

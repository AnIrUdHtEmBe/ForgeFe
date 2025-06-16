// interface BookSlotProps {

import Button from '../../../../components/Button/Button';
import PlayerInfoCard from '../../../../components/PlayerCard/PlayerCard';
import { DEFAULT_ICON_SIZE } from '../../../../default';
import './styles.css';
import { RxCross1 } from 'react-icons/rx';

interface BookSlotProps {
	onClose: () => void;
}

const BookSlot = (props: BookSlotProps) => {
	return (
		<div className="book-slot-overlay-container">
			{/* add cross to close the popup */}
			<div className="book-slot-container">
				<div
					className="--cross"
					onClick={props.onClose}
				>
					<div className="--cross-overlay">
						<RxCross1
							size={DEFAULT_ICON_SIZE - 18}
							color="black"
						/>
					</div>
				</div>
				<div className="book-slot-top-heading-container">
					<span>Book a slot </span>
				</div>
				{/* stepper to be done */}
				<div className="book-slot-player-card-container">
					<PlayerInfoCard />
				</div>
				<div className="--first-time-user">
					{/* insert the coupon component here */}
				</div>
				<div className="bottom-btn-container">
					<Button text="Confirm" />
				</div>
			</div>
		</div>
	);
};

export default BookSlot;

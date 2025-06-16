// interface BookSlotProps {

import Button from '../../../../components/Button/Button';
import PlayerInfoCard from '../../../../components/PlayerCard/PlayerCard';
import { DEFAULT_ICON_SIZE, SNACK_AUTO_HIDE } from '../../../../default';
import './styles.css';
import { RxCross1 } from 'react-icons/rx';
import { bookCourt } from '../../../../api/courts';
import { HttpStatusCode, type AxiosResponse } from 'axios';
import { enqueueSnackbar } from 'notistack';
interface BookSlotProps {
	onClose: () => void;
	startTime?: Date; // ISO datetime string
	endTime?: Date; // ISO datetime string
	courtId?: string;
	viewTimeSlots?: () => void; // Optional function to view time slots
}



const BookSlot = (props: BookSlotProps) => {
	const handleConfirm = async () => {
	if (!props.startTime || !props.endTime || !props.courtId) {
		console.error('Missing required booking information');
		return;
	}

	const bookingData = {
		courtId: props.courtId,
		startTime: props.startTime.toISOString(),
		endTime: props.endTime.toISOString(),
		sportId: 'SPRT_JYIV42',
	};

	const onAccept = (response: AxiosResponse) => {
		if (response.status === HttpStatusCode.Ok) {
			console.log('Booking successful:', response.data);
			props.onClose(); // Close the overlay on success
		} else {
			console.error('Booking failed:', response.data);
			enqueueSnackbar({
				message: 'Booking failed!',
				autoHideDuration: SNACK_AUTO_HIDE,
				variant: 'error',
			});
		}
	};

	const onReject = (error: any) => {
		console.error('Error booking court:', error);
		enqueueSnackbar({
			message: 'Error while booking court!',
			autoHideDuration: SNACK_AUTO_HIDE,
			variant: 'error',
		});
	};

	await bookCourt(onAccept, onReject, bookingData.courtId, bookingData.sportId, bookingData.startTime, bookingData.endTime);
	props.viewTimeSlots?.(); // Call the viewTimeSlots function if provided
};

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
					<PlayerInfoCard courtId={props.courtId} startTime={props.startTime} endTime={props.endTime}/>
				</div>
				<div className="--first-time-user">
					{/* insert the coupon component here */}
				</div>
				<div className="bottom-btn-container">
					<Button text="Confirm" onClick={handleConfirm}/>
				</div>
			</div>
		</div>
	);
};

export default BookSlot;

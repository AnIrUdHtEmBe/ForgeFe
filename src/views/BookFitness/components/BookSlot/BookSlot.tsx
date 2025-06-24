// interface BookSlotProps {

import Button from '../../../../components/Button/Button';
import PlayerInfoCard from '../../../../components/PlayerCard/PlayerCard';
import { DEFAULT_ICON_SIZE, SNACK_AUTO_HIDE } from '../../../../default';
import './styles.css';
import { RxCross1 } from 'react-icons/rx';
// import { bookCourt } from '../../../../api/courts';
import { HttpStatusCode, type AxiosResponse } from 'axios';
import { enqueueSnackbar } from 'notistack';
import type { t_sport } from '../../../../types/sports';
import { createGame } from '../../../../api/games';
interface BookSlotProps {
	onClose: () => void;
	startTime?: Date; // ISO datetime string
	endTime?: Date; // ISO datetime string
	courtId?: string;
	viewTimeSlots?: () => void; // Optional function to view time slots
	sport: t_sport | undefined; // Optional, if you want to pass sportId
	setShowTimeSlots?: (show: boolean) => void; // Optional function to set visibility of time slots
}



const BookSlot = (props: BookSlotProps) => {
	const handleConfirm = async () => {
	if (!props.startTime || !props.endTime || !props.courtId || !props.sport?.sportId) {
		console.error('Missing required booking information');
		return; 
	}

	const bookingData = {
		hostId: "USER_HZSU81",
		sport:props.sport.name,
		bookedBy: "Forge Hub",
		courtId: props.courtId,
		maxPlayers: props.sport?.maxPlayers,
		startTime: props.startTime.toISOString(),
		endTime: props.endTime.toISOString(),
		sportId: props.sport?.sportId ?? '' // Use sportId if available, otherwise an empty string
	};

	const onAccept = (response: AxiosResponse) => {
		if (response.status === HttpStatusCode.Ok) {
			console.log('Booking successful:', response.data);
			props.onClose(); // Close the overlay on success
			enqueueSnackbar({
				message: 'Booking successful!',
				autoHideDuration: SNACK_AUTO_HIDE,
				variant: 'success',
			});
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

	await createGame(onAccept, onReject, bookingData);
	props.viewTimeSlots?.(); // Call the viewTimeSlots function if provided
	props.setShowTimeSlots?.(true); // Hide time slots if setShowTimeSlots is provided
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
					<PlayerInfoCard courtId={props.courtId} startTime={props.startTime} endTime={props.endTime} sport={props.sport?.name} maxPlayers={props.sport?.maxPlayers}/>
				</div>
				<div className="--first-time-user">
					{/* insert the coupon component here */}
				</div>
				<div className="bottom-btn-container">
					<Button text="Add Game" onClick={handleConfirm}/>
				</div>
			</div>
		</div>
	);
};

export default BookSlot;

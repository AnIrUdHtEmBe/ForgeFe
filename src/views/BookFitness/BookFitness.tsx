import { use, useEffect, useState } from 'react';
import CalendarStrip from '../../components/Calendar/Calendar';
import SportStrip from '../../components/SportStrip/SportStrip';
// import { PiCourtBasketball } from 'react-icons/pi';
import './styles.css';
import DropdownMenu, {
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemCheckboxGroup,
	DropdownItemRadio,
	DropdownItemRadioGroup,
} from '@atlaskit/dropdown-menu';
import Button from '../../components/Button/Button';
import BookSlot from './components/BookSlot/BookSlot';
import { getCourts , getTimeSlotForCourt} from '../../api/courts';
import { HttpStatusCode, type AxiosResponse } from 'axios';
import { SNACK_AUTO_HIDE } from '../../default';
import { enqueueSnackbar } from 'notistack';
const BookFitness = () => {
	const [courts, setCourts] = useState<{ name: string , courtId: string}[]>([]);
	const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

	const ViewCourts = () => {
		const onAccept = (response: AxiosResponse) => {
			if (response.status === HttpStatusCode.Ok) {
				console.log(response.data);
				 const newCourts = response.data.map((court: any) => ({
					name: court.name,
					courtId: court.courtId,
				}));
				setCourts(newCourts);
			} else {
				enqueueSnackbar({
					message: 'Failed to fetch the data!',
					autoHideDuration: SNACK_AUTO_HIDE,
					variant: 'error',
				});
			}
		};

		const onReject = (e) => {
			console.log(e);
			enqueueSnackbar({
				message: 'Failed to fetch the data!',
				autoHideDuration: SNACK_AUTO_HIDE,
				variant: 'error',
			});
			
		};

		getCourts(
			onAccept,
			onReject,
			'AREN_JZSW15'
		);
	};
	const [slots , setSlots ] = useState<{startTime:string , endTime: string , status: string, slotId: string}[]>([]);
	const viewTimeSlots = () => {
		// This function can be used to fetch time slots for the selected court
		
		
				
		
				const onAccept = (response: AxiosResponse) => {
					if (response.status === HttpStatusCode.Ok) {
						console.log(response.data);
						const newSlots = response.data.map((slot: any) => ({
							startTime: slot.startTime,
							endTime: slot.endTime,
							status: slot.status,
							slotId: slot.slotId,
						}));
						setSlots(newSlots);
					} else {
						
						enqueueSnackbar({
							message: 'Failed to fetch the data!',
							autoHideDuration: SNACK_AUTO_HIDE,
							variant: 'error',
						});
					}
				};
		
				const onReject = (e) => {
					console.log(e);
					enqueueSnackbar({
						message: 'Failed to fetch the data!',
						autoHideDuration: SNACK_AUTO_HIDE,
						variant: 'error',
					});
					
				};
		
				getTimeSlotForCourt(
					onAccept,
					onReject,
					selectedCourtId,
					activeDate
				);
	};


	useEffect(() => {
		ViewCourts();
	}
	, []);
	useEffect(() => {
		console.log('slots', slots);
		
	},[slots])
	useEffect(() => {
		if (selectedCourtId) {
			viewTimeSlots();
		}
	}
	, [selectedCourtId]);

	const [showBook, setShowBook] = useState(false);
	const [filters, setFitlers] = useState<{
		date: string;
		sport: string;
	}>({
		date: '',
		sport: '',
	});
	
	

	// const slots = [
	// 	{
	// 		startTime: '10:30',
	// 		endTime: '11:30',
	// 		status: 'Available',
	// 	},
	// 	{
	// 		startTime: '10:30',
	// 		endTime: '11:30',
	// 		status: 'Available',
	// 	},
	// 
	// ];

	const status = [
		{
			name: 'available',
			color: 'white',
		},
		{
			name: 'selected',
			color: 'blue',
		},
		{
			name: 'occupied',
			color: 'grey',
		},
		{
			name: 'blocked',
			color: 'red',
		},
	];


  const clickHandler = () => {
    setShowBook(true);
  }
  const [activeDate, setActiveDate] = useState(new Date().toISOString());

  function changeDate(newDate: string) {
	 setActiveDate(newDate);
	 setSlots([]); // Reset slots when date changes
	 setSelectedCourtId(null); // Reset selected court when date changes

	 console.log('Selected Date:', newDate);
	 console.log('Selected Court ID:', selectedCourtId);
	 console.log('Slots:', slots);
	 
  }
	return (
		<div className="book-fitness-container">
			{showBook && <BookSlot onClose={() => setShowBook(false)} />}
			<div className="book-fitness-top-container">
				<div className="--calendar">
					<CalendarStrip
						activeDate={activeDate}
						onDateChangeHandler={
							
							(newDate) => changeDate(newDate)
							
						}
					/>
				</div>
				<div className="--sport">
					<SportStrip
						activeSport={{ name: 'all' }}
						changeActiveSport={() => {}}
					/>
				</div>
			</div>

			<div className="book-fitness-content-container">
				<div className="top-color-section">
					{status.map((state, i) => {
						return (
							<div
								key={i}
								className="--color-box"
							>
								{state.name === 'Selected' && (
									<input
										checked
										type="checkbox"
										className="--color-box-container"
									/>
								)}
								{state.name != 'Selected' && (
									<div
										className="--color-box-container"
										style={{ background: state.color }}
									/>
								)}
								<span>{state.name}</span>
							</div>
						);
					})}
				</div>
				<div className="--court-drop-down">
					<DropdownMenu
						trigger="Select Court"
						shouldRenderToParent
					>
						<DropdownItemRadioGroup
							title=""
							id="actions"
							
							
						>
							{courts.map((court, i) => {
								return (
									<DropdownItemRadio
										key={i}
										id={court.courtId}
										onClick={() => setSelectedCourtId(court.courtId)}
										isSelected={selectedCourtId === court.courtId}
									>
										{court.name}
									</DropdownItemRadio>
								);
							})}
						</DropdownItemRadioGroup>
					</DropdownMenu>
				</div>
				<div className="--time-slot-drop-down">
					<DropdownMenu
						trigger="Select Time Slot"
						shouldFitContainer
						shouldRenderToParent
					>
						<DropdownItemCheckboxGroup
							title="Slots"
							id="actions"
						>
							{slots.map((slot, j) => {
								const index = status.findIndex((el) => el.name === slot.status);
								if (index < 0) return;
								if (status[index].name === 'available') {
									return (
										<DropdownItemCheckbox
											key={j}
											id={slot.endTime}
										>
											{new Date(slot.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}

											{/* {slot.startTime} - {slot.endTime} */}
										</DropdownItemCheckbox>
									);
								}
								return (
									<DropdownItem key={j}>
										<div className="--drop-down">
											<div
												className="--color-box-container"
												style={{
													background: status[index].color,
												}}
											/>
											<span>
												{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}

												
											</span>
										</div>
									</DropdownItem>
								);
							})}
						</DropdownItemCheckboxGroup>
					</DropdownMenu>
				</div>
				<div className="--btn">
					<Button text="Confirm" onClick={clickHandler} />
				</div>
			</div>
		</div>
	);
};

export default BookFitness;

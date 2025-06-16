import {  useEffect, useState } from 'react';
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
import type { t_court } from '../../types/court';
import type { t_slot } from '../../types/slot.ts';
const BookFitness = () => {
	const [courts, setCourts] = useState<{ name: string , courtId: string}[]>([]);
	const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

	const ViewCourts = () => {
		const onAccept = (response: AxiosResponse) => {
			if (response.status === HttpStatusCode.Ok) {
				console.log(response.data);
				 const newCourts = response.data.map((court: t_court) => ({
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
	
	const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
	const [slots , setSlots ] = useState<{startTime:number , endTime: number , status: string, slotId: string}[]>([]);
	const viewTimeSlots = () => {
			const onAccept = (response: AxiosResponse) => {
					if (response.status === HttpStatusCode.Ok) {
						console.log(response.data);
						const newSlots = response.data.map((slot: t_slot) => ({
							startTime: slot.st_unix,
							endTime: slot.et_unix,
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
	
	const handleSlotToggle = (slotId: string) => {
		const index = slots.findIndex((s) => s.slotId === slotId);
		const newSelected = [...selectedSlotIds];

		if (selectedSlotIds.includes(slotId)) {
			// Deselect the slot
			setSelectedSlotIds(newSelected.filter((id) => id !== slotId));
		} else {
			// Check continuity
			const previousId = slots[index - 1]?.slotId;
			const nextId = slots[index + 1]?.slotId;

			const isAdjacent =
			selectedSlotIds.length === 0 ||
			selectedSlotIds.includes(previousId) ||
			selectedSlotIds.includes(nextId);

			if (isAdjacent) {
			newSelected.push(slotId);
			setSelectedSlotIds(newSelected);
			} else {
			// Optionally show error/snackbar
			console.warn("Can only select continuous time slots.");
			}
	}
	};

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
			name: 'booked',
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

  let finalStartTime = 0;
  let finalEndTime = 0;

  useEffect(()=> {
		console.log(selectedSlotIds);
		
	}, [selectedSlotIds])

	// Step 1: Filter slots that are selected
		const selectedSlots = slots
		.filter(slot => selectedSlotIds.includes(slot.slotId))
		.sort((a, b) => a.st_unix - b.st_unix); // Sort by start time to find range

		if (selectedSlots.length === 0) {
		console.log("No slots selected.");
		} else {
		finalStartTime = selectedSlots[0].startTime;
		finalEndTime = selectedSlots[selectedSlots.length - 1].endTime;

		console.log("Final Start:", finalStartTime);
		console.log("Final End:", finalEndTime);
		}

		function combineDateWithUnixTime(dateStr: string, timeUnix: number): Date {
			const time = new Date(timeUnix * 1000); // Convert to milliseconds
			const hours = time.getHours();
			const minutes = time.getMinutes();

			const combinedDate = new Date(dateStr); // Defaults to midnight
			combinedDate.setHours(hours);
			combinedDate.setMinutes(minutes);
			combinedDate.setSeconds(0);
			combinedDate.setMilliseconds(0);

			return combinedDate;
		}
		const startDateTime = combineDateWithUnixTime(activeDate, finalStartTime);
		const endDateTime = combineDateWithUnixTime(activeDate, finalEndTime);
	return (
		<div className="book-fitness-container">
			{showBook && <BookSlot onClose={() => setShowBook(false)} courtId={selectedCourtId} startTime={startDateTime} endTime={endDateTime} viewTimeSlots={viewTimeSlots}/>}
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
						category='SPORTS'
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
											id={slot.slotId}
											isSelected={selectedSlotIds.includes(slot.slotId)}
  											onClick={() => handleSlotToggle(slot.slotId)}
											
										>
											{new Date(Number(slot.startTime) * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(Number(slot.endTime) * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}

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
												{new Date(Number(slot.startTime) * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(Number(slot.endTime) * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}


												
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

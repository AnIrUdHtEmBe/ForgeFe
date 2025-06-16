import { useState } from 'react';
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

const BookFitness = () => {
	const [showBook, setShowBook] = useState(false);
	const [filters, setFitlers] = useState<{
		date: string;
		sport: string;
	}>({
		date: '',
		sport: '',
	});

	const courts = [
		{
			name: 'Court 1',
		},
		{
			name: 'Court 2',
		},
	];

	const slots = [
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Available',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Available',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Occupied',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Blocked',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Blocked',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Occupied',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Occupied',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Occupied',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Available',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Available',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Available',
		},
		{
			startTime: '10:30',
			endTime: '11:30',
			status: 'Available',
		},
	];

	const status = [
		{
			name: 'Available',
			color: 'white',
		},
		{
			name: 'Selected',
			color: 'blue',
		},
		{
			name: 'Occupied',
			color: 'grey',
		},
		{
			name: 'Blocked',
			color: 'red',
		},
	];


  const clickHandler = () => {
    setShowBook(true);
  }

	return (
		<div className="book-fitness-container">
			{showBook && <BookSlot onClose={() => setShowBook(false)} />}
			<div className="book-fitness-top-container">
				<div className="--calendar">
					<CalendarStrip
						activeDate=""
						onDateChangeHandler={() => {}}
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
										id={court.name}
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
								if (status[index].name === 'Available') {
									return (
										<DropdownItemCheckbox
											key={j}
											id={slot.endTime}
										>
											{slot.startTime} - {slot.endTime}
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
												{slot.startTime} - {slot.endTime}
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

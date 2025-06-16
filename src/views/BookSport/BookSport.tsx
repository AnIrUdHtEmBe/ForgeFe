import { useState } from 'react';
import CalendarStrip from '../../components/Calendar/Calendar';
import SportStrip from '../../components/SportStrip/SportStrip';
import './styles.css';
import { SPORTS, UNKNOWN_SPORTS_ICON } from '../../default';
import { useNavigate } from 'react-router-dom';
import E_Routes from '../../types/routes';

const BookSport = () => {
	const [filters, setFitlers] = useState<{
		date: string;
		sport: string;
	}>({
		date: '',
		sport: '',
	});
	const [slots, setSlots] = useState([
		{
			startTime: '10:30',
			slots: [
				{
					name: 'football',
					slot: 3,
					drill: true,
				},
				{
					name: 'football',
					slot: 3,
					drill: true,
				},
			],
		},
		{
			startTime: '12:30',
			slots: [
				{
					name: 'football',
					slot: 3,
					drill: true,
				},
			],
		},
		{
			startTime: '1:30',
			slots: [
				{
					name: 'football',
					slot: 3,
					drill: true,
				},
			],
		},
		{
			startTime: '9:30',
			slots: [
				{
					name: 'run',
					slot: 3,
					drill: true,
				},
			],
		},
		{
			startTime: '10:30',
			slots: [
				{
					name: 'football',
					slot: 3,
					drill: true,
				},
			],
		},
	]);

	const navigate = useNavigate();

	const clickHandler = () => {
		//fill these fields
		navigate(E_Routes.viewCards, { state: { selectedDate: 's', cardInfo: 's' } });
	};

	return (
		<div className="book-sport-container">
			<div className="book-sport-top-calendar">
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
			<div className="book-sport-content-container">
				{slots.map((slot, i) => {
					return (
						<div
							key={i}
							className="book-sport-slot-container"
						>
							<div className="--time">
								<span>{slot.startTime}</span>
							</div>
							<div className="--slots">
								{slot.slots.map((eachSlot, i) => {
									let icon = UNKNOWN_SPORTS_ICON;
									const iconIndex = SPORTS.findIndex(
										(el) =>
											el.name.toLowerCase() === eachSlot.name.toLowerCase()
									);
									if (iconIndex >= 0) {
										icon = SPORTS[iconIndex].icon;
									}
									return (
										<div
											onClick={clickHandler}
											className="--each-slot"
											key={i}
										>
											{eachSlot.drill && <div className="--drill">Drill </div>}
											<div className="--number-slots">{eachSlot.slot} </div>
											<span>{icon}</span>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default BookSport;

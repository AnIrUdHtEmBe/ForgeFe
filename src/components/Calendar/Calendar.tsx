import { useState } from 'react';
import './styles.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarStripProps {
	onDateChangeHandler: (date: string) => void; // expects local ISO string
	activeDate: string; // should also be a local ISO string
}

const CalendarStrip = ({ onDateChangeHandler, activeDate }: CalendarStripProps) => {
	const [selectedDate, setSelectedDate] = useState(new Date(activeDate));
	const [showMonthDropdown, setShowMonthDropdown] = useState(false);

	const year = selectedDate.getFullYear();
	const month = selectedDate.getMonth();

	// Converts a Date to local ISO string (without Z)
	const toLocalISOString = (date: Date): string => {
		const tzOffset = date.getTimezoneOffset() * 60000;
		return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10); // YYYY-MM-DD
	};

	const getDaysInMonth = (year: number, month: number): Date[] => {
		const date = new Date(year, month, 1);
		const days = [];
		while (date.getMonth() === month) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return days;
	};

	const dates = getDaysInMonth(year, month);

	const handleMonthSelect = (monthIndex: number) => {
		const newDate = new Date(selectedDate);
		newDate.setMonth(monthIndex);
		setSelectedDate(newDate);
		setShowMonthDropdown(false);
	};

	const handleDateClick = (date: Date) => {
		setSelectedDate(date);
		onDateChangeHandler(toLocalISOString(date));
	};

	return (
		<div className="calendar-strip-container">
			<div
				className="calendar-strip-header"
				onClick={() => setShowMonthDropdown(!showMonthDropdown)}
			>
				{/* {String(selectedDate.getDate()).padStart(2, '0')} */}{monthNames[month].toUpperCase()}  
			</div>

			{showMonthDropdown && (
				<div className="month-dropdown">
					{monthNames.map((name, index) => (
						<div
							key={name}
							className="month-item"
							onClick={() => handleMonthSelect(index)}
						>
							{name}
						</div>
					))}
				</div>
			)}

			<div className="calendar-strip">
				{dates.map((date) => {
					const isActive = date.toDateString() === selectedDate.toDateString();
					return (
						<div
							key={date.toDateString()}
							className={`calendar-day ${isActive ? '--bookSportActive' : ''}`}
							onClick={() => handleDateClick(date)}
						>
							<div className="day-name">{daysOfWeek[date.getDay()]}</div>
							<div className="day-number">{date.getDate()}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CalendarStrip;

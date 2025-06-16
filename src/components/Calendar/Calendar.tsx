import './styles.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarStripProps {
	onDateChangeHandler: (date: string) => void; // expects local ISO string
	activeDate: string; // should also be a local ISO string
}

const CalendarStrip = (props: CalendarStripProps) => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();

	// Converts a Date to local ISO string (without Z)
	const toLocalISOString = (date: Date): string => {
		const tzOffset = date.getTimezoneOffset() * 60000;
		const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0, 10); // YYYY-MM-DD
		return localISO;
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
	const activeDate = new Date(props.activeDate);

	return (
		<div className="calendar-strip-container">
			<div className="calendar-strip-header">
				{today.toLocaleString('default', { month: 'short' }).toUpperCase()} '
				{String(year).slice(-2)}
			</div>
			<div className="calendar-strip">
				{dates.map((date) => {
					const isToday =
						date.toDateString() === activeDate.toDateString();

					return (
						<div
							key={date.toDateString()}
							className={`calendar-day ${isToday ? '--bookSportActive' : ''}`}
							onClick={() => props.onDateChangeHandler(toLocalISOString(date))}
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

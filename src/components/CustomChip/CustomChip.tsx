import './styles.css';

interface CustomChipProps {
	text: string;
	showSlots?: boolean;
}

const CustomChip = (props: CustomChipProps) => {
	return (
		<div className="player-info-helper-container">
			<div className="chip">
				<span className="--regular">{props.showSlots ? 'Slots left' : ''}</span>
				<span className="--mixed"> {props.text}</span>
			</div>
		</div>
	);
};

export default CustomChip;

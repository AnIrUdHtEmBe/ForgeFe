import './styles.css';

interface CustomChipProps {
	text: number | string | undefined;
	showSlots?: boolean;
}

const CustomChip = (props: CustomChipProps) => {
	return (
		<div className="player-info-helper-container">
			<div className="chip">
				<span className="--mixed"> {props.text}</span>
				<span className="--regular">{props.showSlots ? 'Slots left' : ''}</span>
			</div>
		</div>
	);
};

export default CustomChip;

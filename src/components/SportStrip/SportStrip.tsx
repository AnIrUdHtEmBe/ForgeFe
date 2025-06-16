import type { JSX } from 'react';
import { SPORTS } from '../../default';
import './styles.css';

interface SportStripProps {
	activeSport: { name: string; icon?: JSX.Element };
	changeActiveSport: (newSport: string) => void;
}

const SportStrip = (props: SportStripProps) => {
	return (
		<div className="sport-strip-container">
			<div className="sport-strip-current-filter">
				<span>
					{props.activeSport.icon ||
						(props.activeSport.name === 'all' ? 'All' : '')}
				</span>
			</div>
			<div className="sport-strip-sports-filter">
				{SPORTS.map((sport, i) => {
					return (
						<div
							className="--sport"
							key={i}
						>
							{sport.icon || sport.name}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SportStrip;

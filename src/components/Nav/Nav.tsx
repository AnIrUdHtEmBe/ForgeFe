import { FaRegUserCircle } from 'react-icons/fa';
import './styles.css';
import { DEFAULT_ICON_SIZE } from '../../default';

const Nav = () => {
	return (
		<div className="top-nav-container">
			<div className="--logo">
				<img src="Play_Logo.svg" />
			</div>

			<div className="--center">
				<span>Sarjapur</span>
			</div>
			<div className="--icon">
				<FaRegUserCircle size={DEFAULT_ICON_SIZE} />
			</div>
		</div>
	);
};

export default Nav;

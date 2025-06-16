import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { DEFAULT_ICON_SIZE, wellnessWindows } from '../../default';
import './styles.css';
import { IoIosArrowBack } from 'react-icons/io';
import E_Routes from '../../types/routes';

const BookWellness = () => {
	const navigate = useNavigate();

	const clickHandler = (value: string) => {
		navigate(E_Routes.detailedViewWellness, { state: { descriptor: value } });
	};

	const backHandler = () => {
		window.history.back();
	};

	return (
		<div className="book-wellness-container">
			<div className="--back">
				<IoIosArrowBack
					onClick={backHandler}
					size={DEFAULT_ICON_SIZE - 5}
				/>
			</div>
			<div className="book-wellness-content-container">
				{Object.keys(wellnessWindows).map((keys, i) => {
					const obj = wellnessWindows[keys as keyof typeof wellnessWindows];
					return (
						<div
							key={i}
							className="book-wellness-top-heading-container"
						>
							<div className="--top-heading">{keys}</div>
							<div className="--bottom-content">
								{obj.map((el, i) => {
									return (
										<div
											key={i}
											className="--wellness-box"
										>
											<span className="--icon">{el.icon}</span>
											<span className="--text">{el.name}</span>
											<Button
												text="Explore"
												onClick={() => clickHandler(el.name)}
											/>
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

export default BookWellness;

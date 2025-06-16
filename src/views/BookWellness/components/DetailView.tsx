/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoIosArrowBack } from 'react-icons/io';
import './styles/detail-view.css';
import { useLocation } from 'react-router-dom';
import { DEFAULT_ICON_SIZE, detailsInfoWellness } from '../../../default';
import Button from '../../../components/Button/Button';
import { camelToPascalWithWordSpaces } from '../../../utils/case';

const DetailView = () => {
	const location = useLocation();
	const { descriptor } = location.state;

	const index = Object.keys(detailsInfoWellness).findIndex(
		(el) => el.toLowerCase() === descriptor.toLowerCase()
	);
	if (index < 0) {
		return <span>Invalid Page</span>;
	}
	const keys = Object.keys(detailsInfoWellness);
	const name = keys[index];
	const obj = detailsInfoWellness[name as keyof typeof detailsInfoWellness];

	const backBtnHandler = () => {
		window.history.back();
	};

	return (
		<div className="detail-view-container">
			<div className="image-container">
				<div
					className="--back"
					onClick={backBtnHandler}
				>
					<IoIosArrowBack size={DEFAULT_ICON_SIZE - 5} />
				</div>
				<img src={obj.path} />
			</div>
			<div className="detail-view-content-container">
				<div className="detail-view-top-heading">
					<span>{obj.fullName}</span>
				</div>
				<div className="--line" />
				<div className="--page-title">
					<span>{obj.title}</span>
				</div>
				<div className="detail-view-table-content-container">
					<div className="detail-view-table-top-container">
						<span>Book your session</span>
					</div>
					<div className="--desc">{obj.description}</div>
					<div className="--content">
						{Object.keys(obj.fields).map((key, i) => {
							return (
								<div
									key={i}
									className="--row"
								>
									<span className="--title">
										{camelToPascalWithWordSpaces(key)}
									</span>
									<span className="--val">: {(obj.fields as any)[key]}</span>
								</div>
							);
						})}
					</div>
					<div className="--btn">
						<Button text="Book Now" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailView;

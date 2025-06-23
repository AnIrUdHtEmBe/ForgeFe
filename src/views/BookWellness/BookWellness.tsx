import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { DEFAULT_ICON_SIZE, wellnessWindows } from '../../default';
import './styles.css';
import { IoIosArrowBack } from 'react-icons/io';
import E_Routes from '../../types/routes';
import { getSports } from '../../api/sports';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { HttpStatusCode } from 'axios';
import type { t_sport } from '../../types/sports';
import type { AxiosResponse } from 'axios';
const BookWellness = () => {
	const [sports, setSports] = useState<t_sport[]>([]);  
	const location = useLocation();
  const { descriptor } = location.state;
  console.log(descriptor);
  
	  const getAllSports = () => {
		const onAccept = (response: AxiosResponse) => {
		  if (response.status === HttpStatusCode.Ok) {
			console.log(response.data);
			setSports(response.data);
		  } else {
			enqueueSnackbar({
			  message: "Failed to fetch the data!",
			  autoHideDuration: 3000,
			  variant: "error",
			});
		  }
		};
		const onReject = (e :unknown) => {
		  console.log(e);
		  enqueueSnackbar({
			message: "Failed to fetch the data!",
			autoHideDuration: 3000,
			variant: "error",
		  });
		};
		getSports(onAccept, onReject, "WELLNESS");
	  };
	
	  useEffect(() => {
		  getAllSports();
	  }, []);
    
	const navigate = useNavigate();

	const clickHandler = (value: t_sport) => {
		navigate(E_Routes.detailedViewWellness, { state: { descriptor: value , 
			selectedType: descriptor
		} });
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
					return (
						<div
							key={i}
							className="book-wellness-top-heading-container"
						>
							<div className="--top-heading">Wellness</div>
							<div className="--bottom-content">
								{sports.map((el, i) => {
									return (
										<div
											key={i}
											className="--wellness-box"
										>
											<span className="--icon">{el.icon}</span>
											<span className="--text">{el.name}</span>
											<Button
												text="Explore"
												onClick={() => clickHandler(el)}
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

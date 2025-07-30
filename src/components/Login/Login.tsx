import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './styles.css';
import { E_PageState } from '../../types/state';
import { login, updateNutritionStatus } from '../../api/user';
import { HttpStatusCode, type AxiosResponse } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { SNACK_AUTO_HIDE } from '../../default';

const Login = () => {
	const [input, setInput] = useState('');
	const [pageState, setPageState] = useState(E_PageState.Unknown);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.slice(0, 6); // restrict to 6 characters
		setInput(value);
	};

	const handleLogin = () => {
		setPageState(E_PageState.Loading);
		const onAccept = (response: AxiosResponse) => {
			if (response.status === HttpStatusCode.Ok) {
				setPageState(E_PageState.Accepted);
				
				// res=updateNutritionStatus(response.data.userId)
			} else {
				setPageState(E_PageState.Rejected);
				enqueueSnackbar({
					message: 'Cannot login. Try again later!',
					autoHideDuration: SNACK_AUTO_HIDE,
					variant: 'error',
				});
			}
		};
		const onReject = (e) => {
			console.log(e);
			setPageState(E_PageState.Rejected);
			enqueueSnackbar({
				message: 'Cannot login. Try again later!',
				autoHideDuration: SNACK_AUTO_HIDE,
				variant: 'error',
			});
		};

		login(onAccept, onReject, { userInput: input });
	};

	return (
		<div className="login-container">
			<h2 className="login-heading">
				Write first 3 letters of your name and last 3 of your phone number
			</h2>
			<TextField
				label="Enter Code"
				variant="outlined"
				value={input}
				onChange={handleChange}
				sx={{ paddingBottom: '20px' }}
				inputProps={{ maxLength: 6 }}
				className="login-input"
			/>
			<Button
				variant="contained"
        disabled={pageState === E_PageState.Loading}
				color="primary"
				onClick={handleLogin}
				className="login-button"
			>
				Login
			</Button>
		</div>
	);
};

export default Login;

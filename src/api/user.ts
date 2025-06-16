import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { PATH } from './urlConfig';

export const login = async (
	onAccept: (response: AxiosResponse) => void,
	onReject: (error: unknown) => void,
	data: { userInput: string }
) => {
	try {
		const response = await axios.post(PATH, { ...data });
		onAccept(response);
	} catch (e) {
		onReject(e);
	}
};

import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { PATH , PATH_V2} from './urlConfig';

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

export const getAllUsers  = async (
	onAccept: (response: AxiosResponse) => void,
	onReject: (error: unknown) => void,
	type?: string
) => {
	try {
		const response = await axios.get(`${PATH_V2}/human/all`, {
			params: { type },
		});
		onAccept(response);
	} catch (e) {
		onReject(e);
	}
}

import axios, { type AxiosResponse } from 'axios';
import { GET_USER_PLAN, PATH } from './urlConfig';
import { CheckJWT } from './jwt';

export const getPlans = async (
	onAccept: (response: AxiosResponse) => void,
	onReject: (error: unknown) => void,
	userId: string,
	startDate: string,
	endDate: string
) => {
	try {
		const token = await CheckJWT();
		const url = new URLSearchParams();
		url.set('start', startDate);
		url.set('end', endDate);
		const response = await axios.get(
			PATH + GET_USER_PLAN(userId) + '?' + url.toString(),
			{ headers: { Authorization: 'Bearer ' + token } }
		);
		console.log
		onAccept(response);
	} catch (e) {
		onReject(e);
	}
};

import { HttpStatusCode } from 'axios';

const notLoggedInError = {
	status: HttpStatusCode.Forbidden,
	message: 'Login again',
};
export const CheckJWT = async (authToken?: string) => {
	try {
		const token = authToken || localStorage.getItem('token');
		if (!token) throw notLoggedInError;
		return token;
	} catch (e) {
		return e;
	}
};

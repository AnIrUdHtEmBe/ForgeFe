import axios, { type AxiosResponse } from 'axios';
import { PATH_V2 ,GET_ALL_COURTS } from './urlConfig';
import { CheckJWT } from './jwt';

export const getCourts = async (
    onAccept: (response: AxiosResponse) => void,
    onReject: (error: unknown) => void,
    arenaId: string,
) => {
    try {
        const token = await CheckJWT();
        const response = await axios.get(
            PATH_V2 + GET_ALL_COURTS(arenaId),
            { headers: { Authorization: 'Bearer ' + token } }
        );
        onAccept(response);
    } catch (e) {
        onReject(e);
    }
};

export const getTimeSlotForCourt = async(
    onAccept: (response: AxiosResponse) => void,
    onReject: (error: unknown) => void,
    courtId: string,
    date: string,
) => {
    try {
        const token = await CheckJWT();
        const url = new URLSearchParams();
		url.set('date', date);
        const response = await axios.get(
            PATH_V2 + `/court/${courtId}/slots` + '?' + url.toString(),
            { headers: { Authorization: 'Bearer ' + token } }
        );
        onAccept(response);
    } catch (e) {
        onReject(e);
    }
}

export const bookCourt = async(
    onAccept: (response: AxiosResponse) => void,
    onReject: (error: unknown) => void,
    courtId: string,
    sportId: string,
    startTime: string,
    endTime: string
) => {
    try {
        const token = await CheckJWT();
        const response = await axios.post(
            PATH_V2 + `/court/${courtId}/bookings/create`,
            {
                courtId,
                sportId,
                startTime,
                endTime
            },
            { headers: { Authorization: 'Bearer ' + token } }
        );
        onAccept(response);
    } catch (e) {
        onReject(e);
    }
}

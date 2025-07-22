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
export const getCourtById = async (
    onAccept: (response: AxiosResponse) => void,
    onReject: (error: unknown) => void,
    courtId: string,
) => {
    try {
        const token = await CheckJWT();
        const response = await axios.get(
            PATH_V2 + `/court/${courtId}`,
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
    endTime: string,
    price:number
) => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    console.log(userId)
    const data={
        type:"booking",
        courtId: courtId,
		bookedBy: userId,         
		sportId: sportId,
		startTime: startTime,       
		endTime: endTime,         
		status: 'active' ,
		joinedUsers: [],
		priceType: "ruppes",
  		rackPrice: price,
  		quotePrice: price,
		capacity: 1,
		st_unix:  Math.floor(new Date(startTime).getTime() / 1000),
		et_unix: Math.floor(new Date(endTime).getTime() / 1000),
    }
    console.log(startTime,endTime,data,userId,"[poiuytrf")
    try {
        const token = await CheckJWT();
        const response = await axios.post(
            PATH_V2 + `/court/${courtId}/bookings/create`,
            {
                // courtId,
                // sportId,
                // startTime,
                // endTime
                ...data
            },
            { headers: { Authorization: 'Bearer ' + token } }
        );
        onAccept(response);
    } catch (e) {
        onReject(e);
    }
}

export const getCourtBySportId = async (
    onAccept: (response: AxiosResponse) => void,
    onReject: (error: unknown) => void,
    sportId: string,
) => {
    try {
        const token = await CheckJWT();
        const response = await axios.get(
            PATH_V2 + `/court/courts/for-sport/${sportId}`,
            { headers: { Authorization: 'Bearer ' + token } }
        );
        onAccept(response);
    } catch (e) {
        onReject(e);
    }
};
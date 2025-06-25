import type { AxiosResponse } from "axios";
import { CheckJWT } from "./jwt";
import { ADD_PLAYES_TO_GAME, PATH, PATH_V2 } from "./urlConfig";
import axios from "axios";

export const addPlayersToGame = async (
  onAccept : (response: AxiosResponse) => void,
  onReject : (error: unknown) => void,
  gameId: string,
  userId: string,
  target : string
) => {
  try{
    const token = await CheckJWT();
    const response = await axios.patch(
      PATH_V2 + ADD_PLAYES_TO_GAME(gameId, userId , target),
      { headers: { Authorization: 'Bearer ' + token } }
    );
    onAccept(response);
  }
  catch (e) {
    onReject(e);
  }
}


export const patchSession =  async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  sessionInstanceId: string,
  bookingId : string,
) => {
  console.log("patching session", sessionInstanceId, bookingId);
  try {
    const token = await CheckJWT();
    const response = await axios.patch(
      PATH + `/session-instances/${sessionInstanceId}/attach-booking-or-game`,
      bookingId,
      { headers: { Authorization: 'Bearer ' + token } }
    );
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
}

export const getBookingById = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  bookingId: string
) => {
  try {
    const token = await CheckJWT();
    const response = await axios.get(
      PATH_V2  + `/booking/${bookingId}`,
      { headers: { Authorization: 'Bearer ' + token } }
    );
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
}

export const rescheduleBooking = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  bookingId: string,
  newDate: string,
) => {
  try {
    const token = await CheckJWT();
    const response = await axios.patch(
      PATH_V2 + `/court/booking/${bookingId}/reschedule-by-time?newStartTime=${newDate}`,
      { headers: { Authorization: 'Bearer ' + token } }
    );
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
}
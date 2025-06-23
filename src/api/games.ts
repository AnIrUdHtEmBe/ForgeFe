import type { AxiosResponse } from "axios";
import { CheckJWT } from "./jwt";
import axios from "axios";
import { GET_ALL_GAMES, PATH_V2 } from "./urlConfig";


export const getGamesByDateAndSports = async (
  onAccept : (response : AxiosResponse) =>  void,
  onReject : (error : unknown) => void,
  date : string,
  sportId : string,
  courtId? : string, 
) => {
  try {
    const token = await CheckJWT();
    const res = await axios.get(
      PATH_V2 + GET_ALL_GAMES(sportId, date, courtId || "ALL"),
      { headers: { Authorization: 'Bearer ' + token } }
    )
    // console.log("API Response:", res.data , sportId);
    onAccept(res);
  }
  catch (e) {
    onReject(e);
  }
}




export const joinGame = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  gameId: string,
  playerIds: string[]
) => {
  try {
    const token = await CheckJWT();
    const res = await axios.patch(
      `${PATH_V2}/game/add-players/${gameId}`,
      {}, // No body needed
      {
        headers: { Authorization: 'Bearer ' + token },
        params: { playerIds }, // Send as query params
        paramsSerializer: (params) => {
          return new URLSearchParams(
            params.playerIds.map(id => ['playerIds', id])
          ).toString();
        },
      }
    );
    onAccept(res);
  } catch (e) {
    onReject(e);
  }
}


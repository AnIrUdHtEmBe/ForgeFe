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
    onAccept(res);
  }
  catch (e) {
    onReject(e);
  }
}
import type { AxiosResponse } from "axios";
import { CheckJWT } from "./jwt";
import { ADD_PLAYES_TO_GAME, PATH_V2 } from "./urlConfig";
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
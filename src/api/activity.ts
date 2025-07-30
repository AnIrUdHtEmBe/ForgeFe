import type { AxiosResponse } from "axios";
import { CheckJWT } from "./jwt";
import { ADD_PLAYES_TO_GAME, PATH, PATH_V2 } from "./urlConfig";
import axios from "axios";
export const markActivityComplete=async(
     onAccept: (response: AxiosResponse) => void,
      onReject: (error: unknown) => void,
      activityInstanceId: string,
      sessionInstanceId:string,
      planInstanceId:string
)=> {
  try {
    const token = await CheckJWT();
    const response = await axios.patch(
      PATH  + `/mark_activity_instance_complete/${activityInstanceId}/${sessionInstanceId}/${planInstanceId}`,
      { headers: { Authorization: 'Bearer ' + token } }
    );
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
}
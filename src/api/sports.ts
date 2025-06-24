import axios, { type AxiosResponse } from 'axios';
import { CheckJWT } from './jwt';
import { GET_ALL_SPORTS, PATH_V2 } from './urlConfig';


export const getSports = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  category: string
) => {
  try {
    // console.log("Fetching sports for category:", category);
    const token = await CheckJWT();
    const url = PATH_V2 + GET_ALL_SPORTS(category);
    // console.log("Calling:", url);
    const response = await axios.get(url, {
      headers: { Authorization: "Bearer " + token },
    });
    // console.log("API response:", response.data);
    onAccept(response);
  } catch (e) {
    console.error("API error:", e);
    onReject(e);
  }
};

export const getAllSport = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
) => {
  try {
    // console.log("Fetching sports for category:", category);
    const token = await CheckJWT(); 
    const url = PATH_V2 + "/sports/all";
    // console.log("Calling:", url);
    const response = await axios.get(url, {
      headers: { Authorization: "Bearer " + token },
    });
    // console.log("API response:", response.data);
    onAccept(response);
  } catch (e) {
    console.error("API error:", e);
    onReject(e);
  }
}; 
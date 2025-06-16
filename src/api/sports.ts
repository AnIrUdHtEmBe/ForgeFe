import axios, { type AxiosResponse } from 'axios';
import { CheckJWT } from './jwt';
import { GET_ALL_SPORTS, PATH_V2 } from './urlConfig';


export const getSports = async (
  onAccept : (response: AxiosResponse) => void,
  onReject : (error: unknown) => void,
  category :  string,
) => {
  try{
    const token = await CheckJWT();
    const response = await axios.get(
      PATH_V2 + GET_ALL_SPORTS(category),
      { headers: { Authorization: 'Bearer ' + token } }
    );
    onAccept(response);
  }
  catch (e) {
    onReject(e);
  }
}
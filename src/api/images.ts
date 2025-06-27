import type { AxiosResponse } from "axios";
import axios from "axios";
import { GET_ALL_IMAGES, GET_IMAGE_BY_ID, PATH_V2 } from "./urlConfig";



export const getImagesById = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  userId: string
) => {
  try{
    const response = await axios.post(PATH_V2 + GET_IMAGE_BY_ID(), userId);
    onAccept(response);
  }catch (e) {
    onReject(e);
  }
}

export const getAllImages = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  userIdArray: string[]
) => {
  try{
    // console.log(userIdArray);
    const res = await axios.post(PATH_V2 + GET_ALL_IMAGES(), userIdArray);
    onAccept(res);
  }catch (e) {
    onReject(e);
  }
}
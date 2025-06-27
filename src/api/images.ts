import type { AxiosResponse } from "axios";
import axios from "axios";
import {
  GET_ALL_IMAGES,
  GET_IMAGE_BY_ID,
  PATH_V2,
  UPLOAD_IMAGE,
} from "./urlConfig";

export const getImagesById = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  userId: string
) => {

  console.log("User ID received in getImagesById:", userId);
  try {
    const response = await axios.post(
      PATH_V2 + GET_IMAGE_BY_ID(),
      `${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
};

export const getAllImages = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  userIdArray: string[]
) => {
  try {
    // console.log(userIdArray);
    const res = await axios.post(PATH_V2 + GET_ALL_IMAGES(), userIdArray);
    onAccept(res);
  } catch (e) {
    onReject(e);
  }
};

export const uploadImage = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  userId: string,
  image: File
) => {
  try {
    const user = userId?.replace(/^"(.*)"$/, "$1");
    console.log("Processed userId:", user);
    const formData = new FormData();
    formData.append("humanId", user);
    formData.append("file", image);

    const response = await axios.post(PATH_V2 + UPLOAD_IMAGE(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    onAccept(response);
  } catch (e) {
    onReject(e);
  }
};

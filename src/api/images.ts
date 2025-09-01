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
  humanId: string
) => {
  console.log("Human ID received in getImagesById:", humanId);
  try {
    // Remove quotes from humanId if they exist
    const processedHumanId = humanId.replace(/^"|"$/g, "");
    console.log("Processed Human ID:", processedHumanId);
    const response = await axios.post(
      PATH_V2 + GET_IMAGE_BY_ID(),
      processedHumanId, // Send as plain string, not as JSON object
      {
        headers: {
          "Content-Type": "text/plain", // Change content type to text/plain
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
  humanIds: string[]
) => {
  try {
    const res = await axios.post(
      PATH_V2 + GET_ALL_IMAGES(), 
      humanIds, // Send array directly, not wrapped in object
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    onAccept(res);
  } catch (e) {
    onReject(e);
  }
};

export const uploadImage = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  humanId: string,
  image: File
) => {
  try {
    const processedHumanId = humanId?.replace(/^"(.*)"$/, "$1");
    console.log("Processed humanId:", processedHumanId);
    const formData = new FormData();
    formData.append("humanId", processedHumanId);
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
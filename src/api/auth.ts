import type { AxiosResponse } from "axios";
import type { RegisterFormData } from "../components/Register/Register";
import axios from "axios";
import { LOGIN_HUMANS, PATH_V2, REGISTER_HUMANS } from "./urlConfig";
import type { LoginFormData } from "../components/Login/LoginV2";

export const RegiterUser = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  formData: RegisterFormData
) => {
  try {
    const response = await axios.post(PATH_V2 + REGISTER_HUMANS(), formData);

    onAccept(response);
  } catch (e) {
    onReject(e);
  }
};

export const LoginUser = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  formData: LoginFormData
) => {
  try {
    const response = await axios.post(PATH_V2 + LOGIN_HUMANS(), formData);
    onAccept(response)
  } catch (e) {
    onReject(e);
  }
};

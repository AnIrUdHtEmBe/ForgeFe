import type { AxiosResponse } from "axios";
import type { RegisterFormData } from "../components/Register/Register";
import axios from "axios";
import { LOGIN_HUMANS, PATH_V2, REGISTER_HUMANS } from "./urlConfig";
import type { LoginFormData } from "../components/Login/LoginV2";
import { enqueueSnackbar } from "notistack";

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
    
    if (formData.loginId!=''){
    const response = await axios.post(PATH_V2 + LOGIN_HUMANS(), {
      loginId:formData.loginId,
      password:formData.password
    });
  onAccept(response)
  }
  
    
  } catch (e) {
    onReject(e);
  }
};


export const ResetPassword = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void,
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await axios.post(PATH_V2 + '/auth/reset-password', { email , oldPassword, newPassword });
    onAccept(response);
  } catch (e) {
    onReject(e);
  }
} 

import type { AxiosResponse } from "axios";
import type { RegisterFormData } from "../components/Register/Register";
import axios from "axios";
import { PATH_V2, REGISTER_HUMANS } from "./urlConfig";

export const RegiterUser = async (
  onAccept: (response: AxiosResponse) => void,
  onReject: (error: unknown) => void , 
  formData : RegisterFormData
) => {

  try{

    const response = await axios.post(
      PATH_V2 + REGISTER_HUMANS(),
      formData
    )

    onAccept(response);
  }
  catch(e){
    onReject(e);
  }
};

export const LoginUser = async

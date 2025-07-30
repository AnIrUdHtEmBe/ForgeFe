import React, { useState } from "react";
import "./stylesV2.css";
import type { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { LoginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import E_Routes from "../../types/routes";

export interface  LoginFormData {
  loginId?: string;
  password: string;
}

interface LoginProps {
  handleModal: () => void;
  registermodal: () => void;
}

function LoginV2(props: LoginProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
     loginId: "",
  password: ""
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const { email, mobile } = formData;

    // if (!email && !mobile) {
    //   enqueueSnackbar({
    //       message: "Please enter either a mobile number or an email address.",
    //       autoHideDuration: 3000,
    //       variant: "warning",
    //     });
    //   return;
    // }
    // console.log(formData)

    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        // console.log(response.data)
        localStorage.setItem("token" , JSON.stringify(response.data));
        enqueueSnackbar({
          message: "Success , Redirectiong...",
          autoHideDuration: 3000,
          variant: "success",
        });

        setTimeout(() => {
          navigate(E_Routes.viewPlan)
        }, 1500)
      }
    };

    const onReject = (error: unknown) => {
      console.error("Error fetching games:", error);
      enqueueSnackbar({
        message: "Failed to fetch the data!",
        autoHideDuration: 3000,
        variant: "error",
      });
    };

    LoginUser(onAccept , onReject , formData)


  };


  const handleClick = () => {
    props.handleModal();
    props.registermodal();
  };


  const handleRoute = () => {
    navigate(E_Routes.passwordReset)
  }

  return (
    <div className="register-modal-overlay" onClick={props.handleModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={props.handleModal}>
          &times;
        </button>
        <h2 className="modal-heading">Login</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="email">Email or Mobile:</label>
            <input
              type="text"
              id="loginId"
              name="loginId"
              
              value={formData.loginId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-btn">
            Login
          </button>
          <p className="register-link">
            Don't have an account?{" "}
            <span className="link" onClick={handleClick}>
              Register
            </span>
          </p>

          <p className="register-link">
            Change Password ?
            <span className="link" onClick={handleRoute}>
              Reset
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginV2;

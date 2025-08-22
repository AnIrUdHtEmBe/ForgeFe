import React, { useState } from "react";
import "./stylesV2.css";
import type { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { LoginUser, SendForgotPasswordOtp, ResetPasswordWithOtp } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import E_Routes from "../../types/routes";

// Form Data Types
export interface LoginFormData {
  loginId?: string;
  password: string;
}
interface PasswordResetFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface LoginProps {
  handleModal: () => void;
  registermodal: () => void;
}

function LoginV2(props: LoginProps) {
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent
  // Login state
  const [formData, setFormData] = useState<LoginFormData>({
    loginId: "",
    password: "",
  });
  // Password Reset state
  const [resetData, setResetData] = useState<PasswordResetFormData>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Generic input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!showReset) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setResetData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Login Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        localStorage.setItem("token", JSON.stringify(response.data));
        enqueueSnackbar({
          message: "Success, Redirecting...",
          autoHideDuration: 3000,
          variant: "success",
        });
        setTimeout(() => {
          navigate(E_Routes.viewPlan);
        }, 1500);
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
    LoginUser(onAccept, onReject, formData);
  };

  // Send OTP for Password Reset
  const handleSendOtp = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!formData.loginId) {
      enqueueSnackbar("Please enter an email to send OTP.", {
        variant: "error",
      });
      return;
    }
    setLoading(true);

    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        enqueueSnackbar(response.data.message || "If this email exists, an OTP was sent", { variant: "success" });
        setResetData((prev) => ({ ...prev, email: formData.loginId || "" }));
        setShowReset(true);
        setIsOtpSent(true); // Switch to OTP verification view
        setLoading(false);
      }
    };
    const onReject = (error: unknown) => {
      console.error("Error sending OTP:", error);
      enqueueSnackbar("Failed to send OTP. Check email.", {
        variant: "error",
      });
      setLoading(false);
    };
    await SendForgotPasswordOtp(onAccept, onReject, formData.loginId || "");
  };

  // Password Reset Submit with OTP
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (resetData.newPassword !== resetData.confirmPassword) {
      enqueueSnackbar("Passwords do not match.", { variant: "error" });
      setLoading(false);
      return;
    }
    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        enqueueSnackbar("Password changed successfully!", { variant: "success" });
        setLoading(false);
        setShowReset(false); // Go back to login view
        setIsOtpSent(false); // Reset OTP state
        setResetData({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: "",
        });
        setFormData({
          loginId: "",
          password: "",
        });
      }
    };
    const onReject = (error: unknown) => {
      console.error("Error resetting password:", error);
      enqueueSnackbar("Failed to change password. Check OTP or email.", {
        variant: "error",
      });
      setLoading(false);
    };
    await ResetPasswordWithOtp(onAccept, onReject, resetData.email, resetData.otp, resetData.newPassword);
  };

  // Register link click - do NOT touch this
  // const handleClick = () => {
  //   props.handleModal();
  //   props.registermodal();
  // };

  // Switch to password reset
  const handleRoute = () => {
    setShowReset(true);
    setIsOtpSent(true); // Go directly to OTP entry form
    setResetData((prev) => ({ ...prev, email: formData.loginId || "" })); // Pre-fill email if available
  };

  // Go back to Login view from Reset view
  const handleBackLogin = () => {
    setShowReset(false);
    setIsOtpSent(false); // Reset OTP state
    setResetData({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="register-modal-overlay" onClick={props.handleModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={props.handleModal}>
          &times;
        </button>
        {showReset && isOtpSent ? (
          // Password Reset UI
          <>
            <h2 className="modal-heading">Reset Password</h2>
            <form className="register-form" onSubmit={handleResetSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  required
                  value={resetData.email}
                  onChange={handleChange} // Editable email field
                />
              </div>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  required
                  value={resetData.otp}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  required
                  value={resetData.newPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={resetData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : "Save"}
              </button>
            </form>
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: "var(--grey-600)",
                cursor: "pointer",
              }}
              onClick={handleBackLogin}
            >
              Go back to Login
            </p>
          </>
        ) : (
          // Login UI
          <>
            <h2 className="modal-heading">Login</h2>
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="loginId">Email Or Mobile</label>
                <input
                  type="text"
                  id="loginId"
                  name="loginId"
                  placeholder="Email or Mobile"
                  value={formData.loginId}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ position: "relative" }}>
                <label htmlFor="password">
                  Password
                  <span
                    style={{
                      position: "absolute",
                      right: 0,
                      color: "var(--grey-400)",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    onClick={handleSendOtp}
                  >
                    Forgot Password?
                  </span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="register-btn">
                Login
              </button>
              {/* <p className="register-link">
                Don't have an account?{" "}
                <span className="link" onClick={handleClick}>
                  Register
                </span>
              </p> */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  color: "var(--grey-600)",
                  cursor: "pointer",
                  fontSize: "16px",
                 // textDecoration: "underline",
                }}
                onClick={handleRoute}
              >
                Already received OTP? Click here
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginV2;
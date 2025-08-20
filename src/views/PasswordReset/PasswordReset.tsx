import React, { useState } from "react";
//import { ResetPassword } from "../../api/auth";
// import { AxiosResponse } from 'axios';
import { enqueueSnackbar } from "notistack";
import "./styles.css";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        enqueueSnackbar("Password reset successful!", { variant: "success" });
        setLoading(false);
        navigate("/"); // Redirect to login page after successful reset
      } else {
        enqueueSnackbar("Failed to reset password. Check credentials.", {
          variant: "error",
        });
      }
    };

    const onReject = (error: unknown) => {
      console.error("Error resetting password:", error);
      enqueueSnackbar("Failed to reset password. Check credentials.", {
        variant: "error",
      });
      setLoading(false);
    };

    //await ResetPassword(onAccept, onReject, email, oldPassword, newPassword);
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-heading">Reset Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="reset-password-input"
        />
        <input
          type="password"
          placeholder="Old Password"
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="reset-password-input"
        />
        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="reset-password-input"
        />
        <button
          type="submit"
          className="reset-password-button"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default PasswordReset;
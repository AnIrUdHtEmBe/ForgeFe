import React, { useState } from "react";
import "./styles.css";
import type { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { RegiterUser } from "../../api/auth";

export interface RegisterFormData {
  name: string;
  age: number |  undefined;
  gender: string;
  mobile: string;
  emailId: string;
  password: string;
  type: string;
}

interface RegisterProps {
  handleModal: () => void;
  loginmodal: () => void;
}

function Register(props: RegisterProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    type: "play",
    name: "",
    age: undefined,
    gender: "",
    mobile: "",
    emailId: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    const onAccept = (response: AxiosResponse) => {
      if (response.status === 200) {
        enqueueSnackbar({
          message: "User registered Successfully",
          autoHideDuration: 3000,
          variant: "success",
        });
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

    RegiterUser(onAccept, onReject, formData);
  };

  const handleClick = () => {
    props.handleModal();
    props.loginmodal();
  };

  return (
    <div className="register-modal-overlay" onClick={props.handleModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={props.handleModal}>
          &times;
        </button>
        <h2 className="modal-heading">Register</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              required
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailId">Email:</label>
            <input
              type="email"
              id="email"
              name="emailId"
              required
              value={formData.emailId}
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
          <div className="form-group">
            <label htmlFor="user">Select User Type:</label>
            <select
              id="user"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="play">Play User</option>
              <option value="forge">Forge User</option>
            </select>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
          <p className="register-link">
            Already have an account?{" "}
            <span className="link" onClick={handleClick}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

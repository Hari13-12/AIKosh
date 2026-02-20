import React from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = ({ onClick }) => {
     const navigate = useNavigate();

  const handleClick = () => {
    navigate("/onboarding");
  };
  return (
    <div className="register-wrapper">
    <button className="pumping-btn" onClick={handleClick}>
      <span className="pumping-btn-text">Start Onboarding</span>

      <span className="pumping-btn-icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 10H16M10 4L16 10L10 16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 4L14 10L8 16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
    </div>
  );
};

export default Register;
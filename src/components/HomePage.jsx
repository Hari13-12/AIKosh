import React from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";
import "./HomePage.css";
import { useState } from "react";


// ✅ IMPORT LOGOS
import emblem from "../assets/emblem.png";
import rampLogo from "../assets/ramp.png";
import nsicLogo from "../assets/nse.png"; // adjust if needed
import ondcLogo from "../assets/ondc-network-vertical.png";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeView, setActiveView] = useState("dashboard"); 

  const menuViews = {
  HOME: "home",
  OCR: "ocr",
  ABOUT: "about"
};


  const navigate = useNavigate();
  const handleAIClick = () => {
    navigate("/voice");
  };

  const handleFormClick = () => {
    navigate("/form");
  };

  return (
    <>
      {/* 🔥 GOVERNMENT HEADER */}
      <div className="top-header">
        {/* LEFT LOGOS */}
        <div className="header-left">
          <img src={rampLogo} alt="RAMP" style={{ width: '100px', height: 'auto' }} />
          <img src={emblem} alt="India Emblem" style={{ width: '70px', height: 'auto', margin:"25px" }}/>
        </div>

        {/* CENTER TITLE */}
        <div className="header-center">
          <h2 style = {{}}>एमएसएमई टीम पहल</h2>
          <br />
          <h1 style = {{color: "#E56717"}}>MSME TEAM Initiative</h1>
          <br />
          <h2 style = {{color: "black"}}>MINISTRY OF MICRO, SMALL & MEDIUM ENTERPRISES, GOI</h2>
        </div>

        {/* RIGHT LOGOS */}
        <div className="header-right">
          <img src={nsicLogo} alt="NSIC" style={{ width: '100px', height: 'auto' }}/>
          <img src={ondcLogo} alt="ONDC" style={{ width: '200px', height: 'auto' }}/>
        </div>
      </div>

<nav className="navbar-mainbg">
  <div className="navbar-container">
    <div className="navbar-logo">AI ONDC ONBOARDING</div>



<ul className="navbar-nav">
  {Object.keys(menuViews).map((item) => (
    <li
      key={item}
      className={`nav-item ${activeTab === item ? "active" : ""}`}
      onClick={() => {
        setActiveTab(item);
        setActiveView(menuViews[item]); // ⭐ THIS IS THE KEY
      }}
    >
      <span className="nav-link">{item}</span>
    </li>
  ))}
</ul>


  </div>
</nav>



      {/* 🔥 EXISTING CONTENT */}
      <div className="home-container">

        {/* Upload Documents for OCR */}
        {activeView === "ocr" && (
        <div className="home-content">
          <h1 className="home-title">AI ONDC ONBOARDING</h1>
          <p className="home-subtitle">
            Upload your documents to start the onboarding
          </p>

          <FileUploader />

          <button className="form-btn" onClick={handleFormClick}>
            View Form
          </button>
        </div>
        )}

        {/* 🎙️ Floating AI Button */}
        <button className="ai-float-btn" onClick={handleAIClick}>
          🎙️
        </button>
      </div>
    </>
  );
};

export default HomePage;

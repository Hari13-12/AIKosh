// import React from "react";
// import { useNavigate } from "react-router-dom"; // ⭐ ADD
// import FileUploader from "./FileUploader";
// import "./HomePage.css";

// const HomePage = () => {
//   const navigate = useNavigate(); // ⭐ ADD

//   const handleAIClick = () => {
//     navigate("/voice"); // ⭐ CHANGE ROUTE IF NEEDED
//   };

//   return (
//     <div className="home-container">
//       <div className="home-content">
//         <h1 className="home-title">AI ONDC ONBOARDING</h1>
//         <p className="home-subtitle">
//           Upload your documents to start the onboarding
//         </p>

//         <FileUploader />
//       </div>

//       {/* ⭐ Floating AI Button */}
//       <button className="ai-float-btn" onClick={handleAIClick}>
//         🎙️
//       </button>
//     </div>
//   );
// };

// export default HomePage;



import React from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleAIClick = () => {
    navigate("/voice"); // existing route
  };

  const handleFormClick = () => {
    navigate("/form"); // ⭐ change if your route name is different
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">AI ONDC ONBOARDING</h1>
        <p className="home-subtitle">
          Upload your documents to start the onboarding
        </p>

        <FileUploader />

        {/* ⭐ NEW BUTTON */}
        <button className="form-btn" onClick={handleFormClick}>
          Click below to see your form
        </button>
      </div>

      {/* ⭐ Floating AI Button */}
      <button className="ai-float-btn" onClick={handleAIClick}>
        🎙️
      </button>
    </div>
  );
};

export default HomePage;



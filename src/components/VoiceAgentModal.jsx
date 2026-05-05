// import { useNavigate } from "react-router-dom";
// import VoiceAgent from "./VoiceAgent";
// import "./ChatbotPage.css";

// const VoiceAgentModal = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="modal-overlay" onClick={() => navigate(-1)}>
//       <div
//         className="modal-content large-modal"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <VoiceAgent />
//       </div>
//     </div>
//   );
// };

// export default VoiceAgentModal;
import { useNavigate } from "react-router-dom";
import VoiceAgent from "./VoiceAgent";
import "./ChatbotPage.css";

const VoiceAgentModal = () => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={() => navigate("/mgl")}>
      <div
        className="modal-content large-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <VoiceAgent />
      </div>
    </div>
  );
};

export default VoiceAgentModal;

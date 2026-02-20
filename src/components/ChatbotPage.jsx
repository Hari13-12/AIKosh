import { useNavigate } from "react-router-dom";
import "./ChatbotPage.css";

const ChatbotPage = () => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>AI Chatbot</h2>
        <p>This is your routed popup.</p>
        <button onClick={() => navigate(-1)}>Close</button>
      </div>
    </div>
  );
};

export default ChatbotPage;

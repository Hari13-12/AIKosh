


// import { Routes, Route } from "react-router-dom";
// import VoiceAgent from "./components/VoiceAgent";
// import HomePage from "./components/HomePage";
// import DocumentForm from "./components/DocumentForm";
// import FileUploader from "./components/FileUploader";
// import DocumentUploader from "./components/DocumentUploader";
// import DocumentUploader2 from "./components/DocumentUploader2";
// // import DocumentForm2 from "./components/DocumentForm2";
// import DocumentForm3 from "./components/DocumentForm3";
// import DocumentForm4 from "./components/DocumentForm4";

// function App() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/voice" element={<VoiceAgent />} />
//         <Route path="/form" element={<DocumentForm3 />} />
//         <Route path="/upoad" element={<FileUploader />} />
//         <Route path="/doc" element={<DocumentUploader />} />
//         <Route path="/doc2" element={<DocumentUploader2 />} />
//         <Route path="/form4" element={<DocumentForm4 />} />
        
//       </Routes>
//     </div>
//   );
// }

// export default App;



import { Routes, Route, useLocation } from "react-router-dom";
import VoiceAgent from "./components/VoiceAgent";
import HomePage from "./components/HomePage";
import DocumentForm from "./components/DocumentForm";
import FileUploader from "./components/FileUploader";
import DocumentUploader from "./components/DocumentUploader";
import DocumentUploader2 from "./components/DocumentUploader2";
import DocumentForm3 from "./components/DocumentForm3";
import DocumentForm4 from "./components/DocumentForm4";
import ChatbotPage from "./components/ChatbotPage";
import VoiceAgentModal from "./components/VoiceAgentModal";

function App() {
  const location = useLocation();
  const state = location.state;

  return (
    <div>
      {/* Main Routes */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/voice" element={<VoiceAgent />} />
        <Route path="/form" element={<DocumentForm3 />} />
        <Route path="/upoad" element={<FileUploader />} />
        <Route path="/doc" element={<DocumentUploader />} />
        <Route path="/doc2" element={<DocumentUploader2 />} />
        <Route path="/onboarding" element={<DocumentForm4 />} />
      </Routes>

      {/* Modal Route */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/voice2" element={<VoiceAgentModal />} />
        </Routes>
      )}
    </div>
  );
}

export default App;


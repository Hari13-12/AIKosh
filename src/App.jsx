// import VoiceAgent from "./components/VoiceAgent";
// import FileUploader from "./components/FileUploader";

// function App() {
//   return (
//     <div>
//       <VoiceAgent />
//       <FileUploader />
//     </div>
//   );
// }

// export default App;


// 1202


import { Routes, Route } from "react-router-dom";
import VoiceAgent from "./components/VoiceAgent";
import HomePage from "./components/HomePage";
import DocumentForm from "./components/DocumentForm";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/voice" element={<VoiceAgent />} />
        <Route path="/form" element={<DocumentForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;





// import FileUploader from "./components/FileUploader";
// import VoiceAgentWidget from "./components/VoiceAgentWidget";

// function App() {
//   return (
//     <>
//       {/* Main content */}
//       <FileUploader />

//       {/* Floating AI Agent */}
//       <VoiceAgentWidget />
//     </>
//   );
// }

// export default App;


// import { Routes, Route, Link } from "react-router-dom";
// import VoiceAgent from "./components/VoiceAgent";
// import DocumentForm from "./components/DocumentForm";
// import FileUploader from "./components/FileUploader";
// import HomePage from "./components/HomePage";
// import VoiceAgentWidget from "./components/VoiceAgentWidget";

// function App() {
//   return (
//     <div>
//       <nav style={{ padding: "20px", textAlign: "center" }}>
//         <Link to="/" style={{ marginRight: "20px" }}>
//           Home
//         </Link>
//         <Link to="/voice" style={{ marginRight: "20px" }}>
//           Voice Agent
//         </Link>
//         <Link to="/upload" style={{ marginRight: "20px" }}>
//           Upload File
//         </Link>
//         <Link to="/form">Document Form</Link>
//       </nav>

//       <Routes>
//         {/* ⭐ IMPORTANT: explicit home route */}
//         <Route path="/" element={<HomePage />} />

//         <Route path="/voice" element={<VoiceAgent />} />
//         <Route path="/form" element={<DocumentForm />} />
//         <Route path="/upload" element={<FileUploader />} />

//         {/* fallback */}
//         <Route path="*" element={<HomePage />} />
//       </Routes>

//       {/* ✅ floating widget (always visible) */}
//       <VoiceAgentWidget />
//     </div>
//   );
// }

// export default App;

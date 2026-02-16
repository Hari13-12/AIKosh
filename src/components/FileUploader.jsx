// import React, { useRef, useState } from "react";
// import "./FileUploader.css";

// const FileUploader = ({ onUpload }) => {
//   const fileInputRef = useRef(null);
//   const [files, setFiles] = useState([]);
//   const [error, setError] = useState("");
//   const [dragActive, setDragActive] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const allowedTypes = [
//     "application/pdf",
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//   ];

//   const validateFiles = (fileList) => {
//     for (let file of fileList) {
//       if (!allowedTypes.includes(file.type)) {
//         return `File "${file.name}" is not allowed. Only PDF, JPG, JPEG, PNG.`;
//       }
//     }
//     return "";
//   };

//   const handleFiles = (fileList) => {
//     const validationError = validateFiles(fileList);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setError("");
//     setFiles((prev) => [...prev, ...Array.from(fileList)]);
//   };

//   const handleChange = (e) => {
//     handleFiles(e.target.files);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragActive(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   const removeFile = (index) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) return;

//     setLoading(true);
//     const formData = new FormData();

//     files.forEach((file) => {
//       formData.append("files", file); // important: backend must expect List[UploadFile]
//     });

//     try {
//       const response = await fetch("http://localhost:8080/upload-files", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       console.log("UPLOAD RES", data)

//       if (onUpload) onUpload(data);

//       alert("All files uploaded successfully!");
//       setFiles([]);
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Upload failed.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Multiple Documents</h2>

//       <div
//         className={`drop-zone ${dragActive ? "active" : ""}`}
//         onClick={() => fileInputRef.current.click()}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragActive(true);
//         }}
//         onDragLeave={() => setDragActive(false)}
//         onDrop={handleDrop}
//       >
//         <p>
//           Drag & Drop files here <br />
//           or <span className="browse-text">Browse</span>
//         </p>

//         <input
//           type="file"
//           ref={fileInputRef}
//           multiple
//           onChange={handleChange}
//           accept=".pdf,.jpg,.jpeg,.png"
//           hidden
//         />
//       </div>

//       {files.length > 0 && (
//         <div className="file-list">
//           {files.map((file, index) => (
//             <div key={index} className="file-item">
//               <span>{file.name}</span>
//               <button onClick={() => removeFile(index)}>✕</button>
//             </div>
//           ))}

//           <button
//             className="upload-btn"
//             onClick={handleUpload}
//             disabled={loading}
//           >
//             {loading ? "Uploading..." : "Upload All"}
//           </button>
//         </div>
//       )}

//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// };

// export default FileUploader;



import React, { useRef, useState } from "react";
import "./FileUploader.css";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [uploaded, setUploaded] = useState(false); // 🔥 important

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const validateFiles = (fileList) => {
    for (let file of fileList) {
      if (!allowedTypes.includes(file.type)) {
        return `File "${file.name}" is not allowed.`;
      }
    }
    return "";
  };

  const handleFiles = (fileList) => {
    const validationError = validateFiles(fileList);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
    setUploaded(false); // 🔥 reset upload state if new file added
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setUploaded(false);
  };

  // ✅ Upload Files
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:8080/upload-files", {
        method: "POST",
        body: formData,
      });

      await response.json();

      setUploaded(true); // 🔥 enable processing
      setMessage("Files uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Upload failed.");
    }

    setUploading(false);
  };

  // ✅ Start Background OCR
  const startProcessing = async () => {
    try {
      setProcessing(true);
      setMessage("");

      await fetch("http://localhost:8080/process-files", {
        method: "POST",
      });
      setMessage("Files processing started")
    } catch (err) {
      console.error(err);
      setMessage("Failed to start processing.");
    }

    setProcessing(false);
  };

  return (
    <div className="upload-container">
      <h2>Upload Multiple Documents</h2>

      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p>
          Drag & Drop files here <br />
          or <span className="browse-text">Browse</span>
        </p>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleChange}
          accept=".pdf,.jpg,.jpeg,.png"
          hidden
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name}</span>
              <button onClick={() => removeFile(index)}>✕</button>
            </div>
          ))}

          {/* Upload Button */}
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload All"}
          </button>

          {/* Process Button (enabled only after upload success) */}
          <button
            className="process-btn"
            onClick={startProcessing}
            disabled={!uploaded || processing}
          >
            {processing ? "Starting..." : "Process Uploaded Files"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default FileUploader;

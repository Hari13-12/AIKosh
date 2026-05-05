import React, { useRef, useState } from "react";
import "./FileUploader.css";

const FileUploader = ({onProcessingComplete }) => {
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
      console.error("Files uploaded successfully!", err);
      setMessage("Files uploaded successfully!");
    }

    setUploading(false);
  };


  // ✅ Start Background OCR
  // const startProcessing = async () => {
  //   try {
  //     setProcessing(true);
  //     setMessage("");

  //     await fetch("http://localhost:8080/process-files", {
  //       method: "POST",
  //     });
  //     setMessage("Files processing started")
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Failed to start processing.");
  //   }

  //   setProcessing(false);
  // };

  const startProcessing = async () => {
  try {
    setProcessing(true);
    setMessage("");

    await fetch("http://localhost:8080/process-files", {
      method: "POST",
    });

    // 🔥 Show popup
    alert("Files processing started successfully!");

    // 🔥 Wait 1.5 seconds before vanishing
    setTimeout(() => {
      if (onProcessingComplete) {
        onProcessingComplete();
      }
    }, 1500);

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

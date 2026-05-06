import React, { useRef, useState } from "react";
import "./FileUploader.css";

const FileUploader = ({ onProcessingComplete }) => {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const validateFile = (selectedFile) => {
    if (!allowedTypes.includes(selectedFile.type)) {
      return `File "${selectedFile.name}" is not allowed.`;
    }
    return "";
  };

  const handleFiles = (selectedFiles) => {
    const selectedFile = selectedFiles[0];

    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    handleFiles(e.dataTransfer.files);
  };

  const removeFile = () => {
    setFile(null);
  };

  // ✅ Upload + Start Processing
  const startProcessing = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    try {
      setProcessing(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:8000/process-files",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Processing failed");
      }

      setMessage(`Processing Started. Job ID: ${data.job_id}`);

      alert("File uploaded and processing started successfully!");

      setTimeout(() => {
        if (onProcessingComplete) {
          onProcessingComplete();
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to process file.");
    }

    setProcessing(false);
  };

  return (
    <div className="upload-container">
      <h2>Upload Payment Proof</h2>

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
          Drag & Drop file here <br />
          or <span className="browse-text">Browse</span>
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".pdf,.jpg,.jpeg,.png"
          hidden
        />
      </div>

      {file && (
        <div className="file-list">
          <div className="file-item">
            <span>{file.name}</span>

            <button onClick={removeFile}>✕</button>
          </div>

          <button
            className="process-btn"
            onClick={startProcessing}
            disabled={processing}
          >
            {processing ? "Processing..." : "Upload & Process"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default FileUploader;
import { useState, useRef } from "react";
import { Upload, CheckCircle2, X, FileImage } from "lucide-react";
import aadhaarIcon from "../assets/aadhaar-icon.png";
import panIcon from "../assets/pan-icon.png";
import gstIcon from "../assets/gst-icon.png";
import msmeIcon from "../assets/msme-icon.png";
import "./DocumentUploader.css";

import { uploadDocument } from "../api/uploadDocument";
import { submitDocuments } from "../api/submitDocument";

/* ── Documents Config ── */
const documents = [
  { id: "aadhaar", title: "AADHAR CARD", icon: aadhaarIcon, colorKey: "blue" },
  { id: "pan", title: "PAN CARD", icon: panIcon, colorKey: "amber" },
  { id: "gst", title: "GST CERTIFICATE", icon: gstIcon, colorKey: "teal" },
  { id: "msme", title: "MSME CERTIFICATE", icon: msmeIcon, colorKey: "purple" },
];

/* ✅ Color → documentType mapping */
const COLOR_TO_DOC_TYPE = {
  blue: "aadhaar",
  amber: "pan",
  teal: "gst",
  purple: "msme",
};

/* ── Single Card ── */
const DocumentCard = ({ doc, onUploadChange }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    setFile(f);
    setUploaded(false);

    if (f.type && f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setUploaded(false);
    onUploadChange(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUploadClick = async (e) => {
    e.stopPropagation();
    if (!file) return;

    try {
      setUploading(true);

      const docType = COLOR_TO_DOC_TYPE[doc.colorKey] || doc.id;
      await uploadDocument(file, docType);

      setUploaded(true);
      onUploadChange(true);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
      onUploadChange(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`du-card du-card--${doc.colorKey} ${
        uploading ? "du-card--loading" : ""
      }`}
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {uploaded && (
        <div className="du-badge">
          <div className="du-badge-inner">
            <CheckCircle2 style={{ width: 24, height: 24 }} />
          </div>
        </div>
      )}

      <div className="du-card-content">
        <div className="du-card-icon">
          {preview ? (
            <img src={preview} alt={doc.title} className="preview" />
          ) : (
            <img src={doc.icon} alt={doc.title} className="placeholder" />
          )}
        </div>

        <h3 className="du-card-title">{doc.title}</h3>

        {!file ? (
          <div className={`du-upload-zone du-upload-zone--${doc.colorKey}`}>
            <div className={`du-upload-icon du-upload-icon--${doc.colorKey}`}>
              {uploading ? (
                <span className="du-spinner" />
              ) : (
                <Upload style={{ width: 24, height: 24 }} />
              )}
            </div>
            <span className="du-upload-hint">Tap to upload</span>
          </div>
        ) : (
          <div className="du-file-info">
            <FileImage className="du-file-icon" />
            <span className="du-file-name">{file.name}</span>

            {!uploaded ? (
              <button
                className="du-upload-btn"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            ) : (
              <span className="du-upload-success">✓ Uploaded</span>
            )}

            <button
              className="du-file-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            >
              <X className="du-file-remove-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Uploader ── */
const DocumentUploader2 = () => {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const completedCount = Object.values(uploadedDocs).filter(Boolean).length;
  const totalSteps = documents.length;

  /* ✅ CORRECT place for submit handler */
  const handleSubmitAll = async () => {
    try {
      setSubmitting(true);
      await submitDocuments(); // ⚠️ your API needs no body
      alert("Processing started in background");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to start processing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="document-uploader">
      <main className="du-main">
        <div className="du-title-section">
          <h2 className="du-title">Upload your documents</h2>
        </div>

        <div className="du-grid">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onUploadChange={(hasFile) =>
                setUploadedDocs((prev) => ({
                  ...prev,
                  [doc.id]: hasFile,
                }))
              }
            />
          ))}
        </div>

        <div className="du-submit-section">
          <button
            disabled={completedCount < totalSteps || submitting}
            className="du-submit-btn"
            onClick={handleSubmitAll}
          >
            {submitting ? "Starting..." : "SUBMIT ALL"}
          </button>

          {completedCount < totalSteps && (
            <p className="du-submit-hint">
              Upload all the documents first to continue..
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentUploader2;


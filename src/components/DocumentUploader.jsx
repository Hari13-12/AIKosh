import { useState, useRef } from "react";
import { Upload, CheckCircle2, X, FileImage, Circle } from "lucide-react";
import aadhaarIcon from "../assets/aadhaar-icon.png";
import panIcon from "../assets/pan-icon.png";
import gstIcon from "../assets/gst-icon.png";
import msmeIcon from "../assets/msme-icon.png";
import "./DocumentUploader.css";

/* ── Documents Config ── */
// const documents = [
//   { id: "aadhaar", title: "आधार कार्ड", subtitle: "Aadhaar Card", icon: aadhaarIcon, colorKey: "blue" },
//   { id: "pan", title: "पैन कार्ड", subtitle: "PAN Card", icon: panIcon, colorKey: "amber" },
//   { id: "gst", title: "GST प्रमाणपत्र", subtitle: "GST Certificate", icon: gstIcon, colorKey: "teal" },
//   { id: "msme", title: "MSME प्रमाणपत्र", subtitle: "MSME Certificate", icon: msmeIcon, colorKey: "purple" },
// ];

const documents = [
  { id: "aadhaar", title: "AADHAR CARD", icon: aadhaarIcon, colorKey: "blue" },
  { id: "pan", title: "PAN CARD", icon: panIcon, colorKey: "amber" },
  { id: "gst", title: "GST CERTIFICATE", icon: gstIcon, colorKey: "teal" },
  { id: "msme", title: "MSME CERTIFICATE", icon: msmeIcon, colorKey: "purple" },
];

/* ── Single Card ── */
const DocumentCard = ({ doc, onUploadChange }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    setFile(f);
    onUploadChange(true);

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
    onUploadChange(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`du-card du-card--${doc.colorKey}`}
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

      {file && (
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
        <p className="du-card-subtitle">{doc.subtitle}</p>

        {!file ? (
          <div className={`du-upload-zone du-upload-zone--${doc.colorKey}`}>
            <div className={`du-upload-icon du-upload-icon--${doc.colorKey}`}>
              <Upload style={{ width: 24, height: 24 }} />
            </div>
            {/* <span className="du-upload-text">📷 फ़ोटो खींचें या चुनें</span> */}
            <span className="du-upload-hint">Tap to upload</span>
          </div>
        ) : (
          <div className="du-file-info">
            <FileImage className="du-file-icon" />
            <span className="du-file-name">{file.name}</span>
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
const DocumentUploader = () => {
  const [uploadedDocs, setUploadedDocs] = useState({});

  const completedCount = Object.values(uploadedDocs).filter(Boolean).length;
  const totalSteps = documents.length;
  const percentage = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="document-uploader">
      {/* Header */}
     
      {/* Main */}
      <main className="du-main">
        <div className="du-title-section">
          {/* <h2 className="du-title">📄 अपने दस्तावेज़ अपलोड करें</h2> */}
          <h2 className="du-title">Upload your documents</h2>
          {/* <p className="du-subtitle">
            Upload your documents to start onboarding
          </p> */}
        </div>

        {/* Progress */}
        <div className="du-progress-wrapper">
          <div className="du-progress-header">
            <span className="du-progress-label">
              {completedCount} / {totalSteps} Done ✅
            </span>
            <span className="du-progress-percent">{percentage}%</span>
          </div>

          <div className="du-progress-bar">
            <div
              className="du-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="du-progress-dots">
            {Array.from({ length: totalSteps }).map((_, i) =>
              i < completedCount ? (
                <CheckCircle2
                  key={i}
                  style={{ width: 24, height: 24, color: "hsl(var(--accent))" }}
                />
              ) : (
                <Circle
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    color: "hsl(var(--muted-foreground))",
                    opacity: 0.4,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Cards */}
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

        {/* Submit */}
        <div className="du-submit-section">
          <button
            disabled={completedCount < totalSteps}
            className="du-submit-btn"
          >
            {/* ✅ सब जमा करें — Submit All */}
            SUBMIT ALL
          </button>

          {completedCount < totalSteps && (
            <p className="du-submit-hint">
              {/* सभी {totalSteps - completedCount} दस्तावेज़ अपलोड करें / Upload
              all documents first */}
            Upload all the documents first to continue..
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentUploader;

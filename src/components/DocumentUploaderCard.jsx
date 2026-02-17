import { useState, useRef } from "react";
import { Upload, CheckCircle2, X, FileImage } from "lucide-react";

const DocumentUploadCard = ({
  title,
  subtitle,
  icon,
  borderColor,
  bgColor,
  accentColor,
  onUploadChange,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    setFile(f);
    onUploadChange?.(true);

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
    onUploadChange?.(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`relative rounded-2xl border-2 ${borderColor} ${bgColor} p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer`}
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleChange}
      />

      {/* Status badge */}
      {file && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-accent text-accent-foreground rounded-full p-1.5 shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      )}

      {/* Document icon */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex items-center justify-center bg-card shadow-sm">
          {preview ? (
            <img
              src={preview}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={icon}
              alt={title}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-foreground text-center leading-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          {subtitle}
        </p>

        {/* Upload area */}
        {!file ? (
          <div
            className={`w-full mt-2 border-2 border-dashed ${borderColor} rounded-xl p-4 flex flex-col items-center gap-2 transition-colors`}
          >
            <div className={`${accentColor} rounded-full p-3`}>
              <Upload className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              📷 फ़ोटो खींचें या चुनें
            </span>
            <span className="text-xs text-muted-foreground">
              Tap to upload
            </span>
          </div>
        ) : (
          <div className="w-full mt-2 flex items-center gap-2 bg-accent/10 rounded-xl p-3">
            <FileImage className="w-5 h-5 text-accent shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate flex-1">
              {file.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 rounded-full hover:bg-destructive/10 transition-colors"
            >
              <X className="w-5 h-5 text-destructive" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadCard;

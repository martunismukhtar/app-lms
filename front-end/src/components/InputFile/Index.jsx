import { useState, useEffect, useCallback, useMemo } from "react";
import { Upload, X, FileText, FileSpreadsheet } from "lucide-react";

// Constants
const FILE_TYPES = {
  PDF: "application/pdf",
  CSV: "text/csv",
  EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const DEFAULT_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: [FILE_TYPES.PDF, FILE_TYPES.CSV],
};

const ERROR_MESSAGES = {
  INVALID_TYPE: "File yang dipilih tidak sesuai format yang diizinkan.",
  FILE_TOO_LARGE: "Ukuran file terlalu besar. Maksimal {size}.",
  UPLOAD_FAILED: "Gagal mengunggah file. Silakan coba lagi.",
};

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (fileType) => {
  switch (fileType) {
    case FILE_TYPES.PDF:
      return <FileText className="w-5 h-5 text-red-500" />;
    case FILE_TYPES.CSV:
    case FILE_TYPES.EXCEL:
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    default:
      return <FileText className="w-5 h-5 text-gray-500" />;
  }
};

const validateFile = (file, acceptedTypes, maxSize) => {
  const errors = [];    
  // Validate file type
  if (!acceptedTypes.includes(file.type)) {
    errors.push(ERROR_MESSAGES.INVALID_TYPE);
  }
  
  // Validate file size
  if (file.size > maxSize) {
    errors.push(
      ERROR_MESSAGES.FILE_TOO_LARGE.replace("{size}", formatFileSize(maxSize))
    );
  }
  
  return errors;
};

// File preview component
const FilePreview = ({ file, onRemove, showRemove = true }) => {
  if (!file) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex items-center gap-3">
        {getFileIcon(file.type)}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 truncate max-w-48">
            {file.name}
          </span>
          <span className="text-xs text-gray-500">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>
      
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Hapus file"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Error display component
const ErrorDisplay = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {errors.map((error, index) => (
        <p key={index} className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      ))}
    </div>
  );
};

// Help text component
const HelpText = ({ acceptedTypes, maxSize }) => {
  const typeNames = acceptedTypes.map(type => {
    switch (type) {
      case FILE_TYPES.PDF: return "PDF";
      case FILE_TYPES.CSV: return "CSV";
      case FILE_TYPES.EXCEL: return "Excel";
      default: return type;
    }
  }).join(", ");

  return (
    <p className="mt-1 text-xs text-gray-500">
      Format: {typeNames} • Maksimal: {formatFileSize(maxSize)}
    </p>
  );
};

// Main InputFile component
const InputFile = ({
  accept,
  maxSize = DEFAULT_CONFIG.MAX_SIZE,
  label,
  name = "file",
  required = false,
  onChange = () => {},
  onError = () => {},
  error: externalError,
  value,
  reset = false,
  disabled = false,
  placeholder = "Pilih file atau drag & drop di sini",
  showPreview = true,
  showHelpText = true,
  className = "",
  ...props
}) => {
  // State management
  const [internalError, setInternalError] = useState([]);
  const [selectedFile, setSelectedFile] = useState(value || null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Memoized accepted types
  const acceptedTypes = useMemo(() => {
    if (accept) {
      return accept.split(",").map(type => type.trim());
    }
    return DEFAULT_CONFIG.ACCEPTED_TYPES;
  }, [accept]);

  // Reset file when reset prop changes
  useEffect(() => {
    if (reset) {
      setSelectedFile(null);
      setInternalError([]);
    }
  }, [reset]);

  // Sync with external value
  useEffect(() => {
    setSelectedFile(value || null);
  }, [value]);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    setInternalError([]);

    // Validate file
    const validationErrors = validateFile(file, acceptedTypes, maxSize);
    
    if (validationErrors.length > 0) {
      setInternalError(validationErrors);
      setSelectedFile(null);
      onError(validationErrors);
      return;
    }

    // File is valid
    setSelectedFile(file);
    onChange({ target: { name, files: [file], value: file } });
  }, [acceptedTypes, maxSize, name, onChange, onError]);

  // Handle file input change
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setInternalError([]);
    onChange({ target: { name, files: [], value: null } });
  }, [name, onChange]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  }, [disabled, handleFileSelect]);

  // Determine which errors to show
  const displayErrors = externalError 
    ? (Array.isArray(externalError) ? externalError : [externalError])
    : internalError;

  const hasError = displayErrors.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* File Input Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-all duration-200
          ${isDragOver && !disabled 
            ? 'border-blue-400 bg-blue-50' 
            : hasError 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          aria-label={label || "Upload file"}
          name={name}
          required={required}
          disabled={disabled}
          {...props}
        />

        {/* Upload Area Content */}
        <div className="p-6 text-center">
          {selectedFile ? (
            showPreview && (
              <FilePreview 
                file={selectedFile} 
                onRemove={handleRemoveFile}
                showRemove={!disabled}
              />
            )
          ) : (
            <div className="space-y-2">
              <Upload className={`w-8 h-8 mx-auto ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm text-gray-600">{placeholder}</p>
                <p className="text-xs text-gray-500 mt-1">
                  atau klik untuk memilih file
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      {showHelpText && !hasError && (
        <HelpText acceptedTypes={acceptedTypes} maxSize={maxSize} />
      )}

      {/* Error Display */}
      <ErrorDisplay errors={displayErrors} />
    </div>
  );
};

export default InputFile;
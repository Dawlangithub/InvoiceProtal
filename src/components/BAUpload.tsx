import React, { useRef, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

interface FileUploadToBlobProps {
  onFileUpload?: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  uploadText?: string;
  listType?: any;
  size?: number;
  getUrl?: any;
}

const FileUploadToBlob: React.FC<FileUploadToBlobProps> = ({
  onFileUpload,
  accept = "image/*",
  disabled = false,
  uploadText = "Upload",
  size = 130,
  getUrl,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => {
    if (disabled) return;
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setImageUrl(url || getUrl);
    if (onFileUpload) onFileUpload(file);
  };

  const handleRemove = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
  };

  const circleStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "20%",
    border: "1px dashed #d9d9d9",
    background: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    position: "relative",
    overflow: "hidden",
    userSelect: "none",
    marginTop: 5,
  };

  const hoverRing: React.CSSProperties = isHover && !disabled ? { borderColor: "#583f7d" } : {};

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div
        style={{ ...circleStyle, ...hoverRing }}
        onClick={openFileDialog}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        aria-disabled={disabled}
        role="button"
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="uploaded"
              style={{ width: "98%", height: "98%", borderRadius: "20%", objectFit: "cover", padding: 3, opacity: isHover ? 0.6 : 1 }}
            />
            {isHover && !disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Remove image"
                title="Remove"
              >
                <DeleteOutlined />
              </button>
            )}
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#999" }}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{uploadText}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadToBlob;

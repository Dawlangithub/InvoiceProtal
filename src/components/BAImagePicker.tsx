import React, { useRef, useState } from "react";
import { CloseOutlined } from '@ant-design/icons';
import { primary } from "../config/theme/variable";

interface BAImagePickerProps {
    onChange: (files: File[]) => void;
    accept?: string;
    disabled?: boolean;
    uploadText?: string;
    value?: string;
}

const BAImagePicker: React.FC<BAImagePickerProps> = ({
    onChange,
    accept = "image/*",
    disabled = false,
    uploadText = "Select Image",
    value
}) => {
    const [image, setImage] = useState<{ file: File; url: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        const imgObj = { file, url: URL.createObjectURL(file) };
        setImage(imgObj);
        onChange([file]);
    };

    const handleRemove = () => {
        setImage(null);
        onChange([]);
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={false}
                style={{ display: "none" }}
                disabled={disabled}
                onChange={(e) => handleFiles(e.target.files)}
            />
            <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-lg cursor-pointer"
                onClick={() => inputRef.current?.click()}
                style={{ display: "flex", gap: 8, marginTop: 8, width: 100, height: 100 }}
            >
                {image ? (
                    <div style={{ position: "relative" }}>
                        <img
                            className="rounded-lg"
                            src={image.url}
                            alt="preview"
                            style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
                        />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                background: primary,
                                color: "white",
                                border: "none",
                                borderRadius: "20%",
                                width: 20,
                                height: 20,
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <CloseOutlined />
                        </button>
                    </div>
                ) : value ? (
                    <img
                        src={value}
                        alt="preview-value"
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
                    />
                ) : (
                    <span style={{ color: "#aaa" }}>{uploadText}</span>
                )}
            </div>
        </div>
    );
};

export default BAImagePicker;
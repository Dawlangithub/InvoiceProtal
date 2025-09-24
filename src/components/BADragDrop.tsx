import React, { useState, useRef } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { message, Upload, Image } from "antd";

const { Dragger } = Upload;

interface FileUploadToBlobProps extends UploadProps {
  onFileUpload: (file: any) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  uploadText?: string;
  action?: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const BADragDropFile: React.FC<FileUploadToBlobProps> = ({
  onFileUpload,
  accept = ".jpg, .jpeg, .png, .pdf, .xls, .xlsx",
  multiple = false,
  disabled = false,
  uploadText = "Click or drag file to this area to upload",
  action,
  ...rest
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArr = Array.from(files);
    const newImages = fileArr.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const updatedImages: any = [...fileList, ...newImages];
    setFileList(updatedImages);
    onFileUpload(updatedImages.map((img: any) => img.file));
  };

  const handleRemove = (idx: number) => {
    const updatedImages = fileList.filter((_, i) => i !== idx);
    setFileList(updatedImages);
    onFileUpload(updatedImages.map((img: any) => img.file));
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple,
    accept,
    action,
    disabled,
    fileList,
    showUploadList: true,
    beforeUpload(file) {
      if (fileList.length >= 3) {
        message.error("You can only upload up to 3 files.");
        return Upload.LIST_IGNORE;
      }

      if (onFileUpload) {
        onFileUpload(file);
      }

      setFileList((prev) => [...prev, file]);
      return false; // Prevents default upload
    },
    onChange(info) {
      setFileList(info.fileList);
      if (onFileUpload) {
        onFileUpload(info.fileList);
      }
    },
    onDrop(e) {
      onFileUpload(e);
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      if (onFileUpload) {
        onFileUpload(fileList.filter((f) => f.uid !== file.uid));
      }
    },
    ...rest,
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <>
      <Dragger {...uploadProps} maxCount={3}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{uploadText}</p>
        <p className="ant-upload-hint">Supports single or bulk upload.</p>
      </Dragger>

      {fileList.length > 0 && (
        <div className="flex justify-center p-5">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onRemove={(file) =>
              setFileList((prev) => prev.filter((f) => f.uid !== file.uid))
            }
            openFileDialogOnClick={false}
          />
        </div>
      )}

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button type="button" onClick={() => inputRef.current?.click()}>
        Select Images
      </button>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {fileList.map((img, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <img
              src={img.url}
              alt={`preview-${idx}`}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default BADragDropFile;

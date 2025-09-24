import { Modal } from "antd";
import React from "react";
import { ScanOutlined } from "@ant-design/icons";

interface FingerprintModalProps {
  fingerprintModal: boolean;
  setFingerprintModal: (value: boolean) => void;
  fingerprintImage?: string | null;
  handleSaveFingerprint: () => void | Promise<void>;
  handleFingerprintScan: () => void | Promise<void>;
  fingerprintLoading: boolean;
}

const FingerprintModal: React.FC<FingerprintModalProps> = ({
  fingerprintModal,
  setFingerprintModal,
  fingerprintImage,
  handleSaveFingerprint,
  handleFingerprintScan,
  fingerprintLoading,
}) => {
  return (
    <Modal
      title="Fingerprint Scanner"
      open={fingerprintModal}
      onCancel={() => setFingerprintModal(false)}
      footer={null}
      width={500}
      centered
    >
      {/* Canvas Area */}
      <div className="border-2 border-dashed border-[##242b64] rounded-lg p-4 mb-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
        {fingerprintImage ? (
          <img
            src={fingerprintImage}
            alt="Fingerprint"
            className="max-w-full max-h-48 object-contain"
          />
        ) : (
          <div className="text-center text-gray-500">
            <ScanOutlined className="text-4xl mb-2" />
            <p>No fingerprint captured</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {/* Scan Button */}
        <button
          onClick={handleFingerprintScan}
          disabled={fingerprintLoading}
          className="w-1/2 bg-white text-[##242b64] cursor-pointer border border-[##242b64] font-medium py-2 px-4 rounded-lg flex items-center justify-center"
        >
          {fingerprintLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 mr-2 border-2 border-t-transparent border-[##242b64]"></div>
              Scanning...
            </>
          ) : (
            <>
              <ScanOutlined className="mr-2" />
              Scan Fingerprint
            </>
          )}
        </button>

        {/* Save Button */}
        {fingerprintImage && (
          <button
            onClick={handleSaveFingerprint}
            className="w-1/2 bg-[##242b64] cursor-pointer text-white font-medium py-2 px-4 rounded-lg"
          >
            Save Fingerprint
          </button>
        )}
      </div>
    </Modal>
  );
};

export default FingerprintModal;

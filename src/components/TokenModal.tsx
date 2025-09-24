import { Modal } from "antd";

interface HeldToken {
  tokenNo?: string;
  holdDate: string | Date;
}

interface TokenModalProps {
  holdedModalVisible: boolean;
  setHoldedModalVisible: (value: boolean) => void;
  holdedTokens: HeldToken[];
  handleUnholdToken: (token: HeldToken) => void | Promise<void>;
}

const TokenModal: React.FC<TokenModalProps> = ({
  holdedModalVisible,
  setHoldedModalVisible,
  holdedTokens,
  handleUnholdToken,
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">
            Held Tokens ({holdedTokens.length})
          </span>
        </div>
      }
      open={holdedModalVisible}
      onCancel={() => setHoldedModalVisible(false)}
      footer={null}
      width={500}
      centered
    >
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        {holdedTokens.map((token, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-start justify-between shadow-xs cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => handleUnholdToken(token)}
          >
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-medium bg-gray-100 text-[##242b64] px-2 py-0.5 rounded">
                  {new Date(token.holdDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  Held at{" "}
                  {new Date(token.holdDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm ml-[2px]">
                Token{" "}
                <span className="text-gray-600">
                  #{token.tokenNo || "N/A"}
                </span>
              </h3>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default TokenModal;

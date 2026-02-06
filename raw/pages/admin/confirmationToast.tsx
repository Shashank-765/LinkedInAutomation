import React from "react";
import { toast } from "react-toastify";

interface ConfirmationToastProps {
  closeToast?: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  closeToast,
  onConfirm,
  message = "Are you sure you want to proceed?"
}) => {
  const handleConfirm = () => {
    onConfirm();
    closeToast?.();
  };

  const handleCancel = () => {
    closeToast?.();
  };

  return (
    <div style={{ padding: "10px", minWidth: "260px" }}>
      <p>{message}</p>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px"
        }}
      >
        <button
          onClick={handleCancel}
          style={{
            backgroundColor: "#e5e7eb",
            color: "#111",
            padding: "5px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "5px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmationToast;

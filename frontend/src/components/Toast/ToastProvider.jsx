import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          style={{
            position: "fixed",
            top: "25px",
            right: "25px",
            zIndex: 999999,

            minWidth: "300px",
            maxWidth: "450px",

            padding: "16px 20px",

            borderRadius: "10px",

            background:
              toast.type === "success"
                ? "#d1e7dd"
                : toast.type === "error"
                ? "#f8d7da"
                : toast.type === "warning"
                ? "#fff3cd"
                : "#cfe2ff",

            color:
              toast.type === "success"
                ? "#0f5132"
                : toast.type === "error"
                ? "#842029"
                : toast.type === "warning"
                ? "#856404"
                : "#084298",

            border: "1px solid rgba(0,0,0,0.15)",

            boxShadow: "0 5px 20px rgba(0,0,0,0.25)",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            gap: "15px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              whiteSpace: "pre-line",
            }}
          >
            {toast.type === "success" && "✓ "}
            {toast.type === "error" && "✕ "}
            {toast.type === "warning" && "⚠ "}

            {toast.message}
          </span>

          <button
            onClick={closeToast}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "20px",
              cursor: "pointer",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
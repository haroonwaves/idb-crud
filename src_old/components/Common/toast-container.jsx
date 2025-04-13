import { useState, useEffect } from "preact/hooks";
import { setUpdateFunction } from "../../Toast/toast-manager";
import Toast from "../../Toast/toast";

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setUpdateFunction(setToasts);
  }, []);

  return (
    <div
      style={{
        position: "fixed", // Fixed position
        bottom: "20px", // 20px from the bottom
        right: "20px", // 20px from the right
        zIndex: 1000, // High z-index to stay on top
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end", // Aligns toasts to the right
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
  );
}

export default ToastContainer;

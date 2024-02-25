import { useEffect } from "preact/hooks";
import { hideToast } from "./toast-manager";

import SuccessImage from "../image/success.svg?component";
import CrossImage from "../image/cross.svg?component";
import InfoImage from "../image/info.svg?component";

function Toast({ id, message, type }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      hideToast(id);
    }, 3000); // auto-hide after 3 seconds

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "10px 20px",
        margin: "5px 0",
        borderRadius: "5px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        maxWidth: "300px", // Optional, for controlling toast width
        wordWrap: "break-word",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <spam>{message}</spam>
      <spam>
        {type === "success" ? (
          <SuccessImage />
        ) : type === "failure" ? (
          <CrossImage />
        ) : type === "info" ? (
          <InfoImage />
        ) : (
          ""
        )}
      </spam>
    </div>
  );
}

export default Toast;

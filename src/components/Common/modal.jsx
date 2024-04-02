import { useEffect, useRef } from "preact/hooks";
import Button from "./button";

const modalSize = {
  "ex-small": "10%",
  small: "20%",
  medium: "30%",
  large: "40%",
  "ex-large": "50%",
  default: "fit-content",
};

export default function Modal({
  show = false,
  onClose = () => {},
  onClick = () => {},
  closeOnBlur = true,
  size = "default", // ex-small || small || medium || large || ex-large
  backgroundEffect = null, // null || shadow || blur
  hideFooter = false,
  header,
  children,
}) {
  function onBlur() {
    if (closeOnBlur) onClose();
  }

  const modalRef = useRef(null);

  useEffect(() => {
    if (show) {
      modalRef.current?.focus();
    }
  }, [show]);

  if (!show) return null;

  const addBackgroundBlur = backgroundEffect === "blur";

  const maxWidth = modalSize[size];

  return (
    <>
      {backgroundEffect && (
        <div
          width={"100%"}
          className={`fixed inset-0 bg-black bg-opacity-30 z-40 ${
            addBackgroundBlur ? "backdrop-filter backdrop-blur-sm" : ""
          }`}
        ></div>
      )}
      <div
        className="hidden fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
        id="static-modal"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className={`relative p-4 max-w-2xl max-h-full focus:outline-none focus:ring-2 focus:ring-transparent focus:border-transparent`}
          ref={modalRef}
          tabIndex={-1}
          onBlur={onBlur}
          style={{
            maxWidth: maxWidth,
          }}
        >
          <div className="relative bg-white rounded-lg shadow-lg">
            {header && (
              <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t">
                <h4 className="text-xl font-semibold">{header}</h4>
              </div>
            )}
            <div className="p-4 md:p-5 space-y-4">{children}</div>
            {!hideFooter && (
              <div className="flex items-center p-4 md:p-5 border-t rounded-b gap-5">
                <Button text={"OK"} onClick={onClick} />
                <Button text={"CLOSE"} type={"secondary"} onClick={onClose} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

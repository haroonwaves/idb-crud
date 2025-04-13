import tooltipStyles from "./Style/tooltip.scss?inline";

const positions = {
  bottom: {
    marginTop: "8px",
    marginLeft: "-60px",
    left: "50%",
    top: "100%",
  },
  left: {
    marginLeft: "-8px",
    left: 0,
    top: "50%",
    transform: "translate(-100%, -50%)",
  },
};

const Tooltip = ({ children, text, className = "", position = "bottom" }) => {
  return (
    <>
      <style>{tooltipStyles}</style>
      <span className={"idb-crud-tooltip " + className}>
        {children}
        <span
          className="idb-crud-tooltip-text"
          style={{ ...positions[position] }}
        >
          {text}
        </span>
      </span>
    </>
  );
};

export default Tooltip;

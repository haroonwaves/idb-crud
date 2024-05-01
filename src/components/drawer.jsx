import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "preact/hooks";
import { createRef } from "preact";

import Main from "./Main/main";
import Sidebar from "./Sidebar/sidebar";
import CrossIcon from "../icons/cross.svg?component";

import drawerStyles from "./styles/drawer.scss?inline";

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black overlay
  overlay.style.zIndex = "9999";
  overlay.id = "idb-crud-overlay";

  document.body.appendChild(overlay);
  document.body.classList.add("idb-crud-drawer-open");
}

function removeOverlay() {
  const overlay = document.getElementById("idb-crud-overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }

  document.body.classList.remove("idb-crud-drawer-open");
}

const Drawer = ({
  open,
  setOpen,
  closeDrawerRef,
  connectToDatabase,
  connected,
}) => {
  const idbCrudDrawerRef = createRef();

  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const refreshDatabase = () => {
    connectToDatabase();
    setSelectedDatabase(null);
    setSelectedTable(null);
  };

  useEffect(() => {
    if (open) {
      idbCrudDrawerRef.current.focus();
      setTimeout(() => {
        createOverlay();
      }, 200);
    } else {
      idbCrudDrawerRef.current.blur();
      setTimeout(() => {
        removeOverlay();
      }, 200);
    }
  }, [open]);

  useEffect(() => {
    closeDrawerRef.current = () => {
      setSelectedTable(null);
      setOpen(false);
    };
  }, []);

  return (
    <>
      <style>{drawerStyles}</style>
      <div
        ref={idbCrudDrawerRef}
        className={`idb-crud-drawer ${open ? "open" : ""}`}
        tabIndex={-1} // focusable
        // onBlur={() => setOpen(false)}
      >
        {open ? (
          <span className="idb-crud-drawer-close-btn">
            <CrossIcon onClick={closeDrawerRef.current} />
          </span>
        ) : null}

        {open ? (
          <PanelGroup direction="horizontal">
            <>
              <Panel
                className="!overflow-y-auto !overflow-x-hidden !text-nowrap"
                id="idb-crud-side-panel"
                defaultSize={15}
                minSize={10}
                order={1}
              >
                <Sidebar
                  connected={connected}
                  selectedDatabase={selectedDatabase}
                  setSelectedDatabase={setSelectedDatabase}
                  selectedTable={selectedTable}
                  setSelectedTable={setSelectedTable}
                  refreshDatabase={refreshDatabase}
                />
              </Panel>
              <PanelResizeHandle
                className="idb-crud-panel-resizer"
                style={styles.resizeHandler}
              />
            </>
            <Panel id="idb-crud-main-panel" minSize={80} order={2}>
              <Main
                selectedDatabase={selectedDatabase}
                selectedTable={selectedTable}
              />
            </Panel>
          </PanelGroup>
        ) : null}
      </div>
    </>
  );
};

const styles = {
  resizeHandler: {
    width: "2px",
    background: "#e2e8f0",
  },
};

export default Drawer;

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "preact/hooks";
import { createRef } from "preact";

import Main from "./Main/main";
import Sidebar from "./Sidebar/sidebar";
import CrossIcon from "../icons/cross.svg?component";

import drawerStyles from "./styles/drawer.scss?inline";

const Drawer = ({ open, closeDrawer, connectToDatabase, connected }) => {
  const idbCrudDrawerRef = createRef();

  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    if (open) {
      idbCrudDrawerRef.current.focus();
    } else {
      idbCrudDrawerRef.current.blur();
    }
  }, [open]);

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
          <span
            className="idb-crud-drawer-close-btn"
            onClick={() => closeDrawer}
          >
            <CrossIcon />
          </span>
        ) : null}
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
                connectToDatabase={connectToDatabase}
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

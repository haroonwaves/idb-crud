import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "preact/hooks";
import { createRef } from "preact";

import Main from "./Main/main";
import Sidebar from "./Sidebar/sidebar";

import drawerStyles from "./styles/drawer.scss?inline";

const Drawer = ({ open, setOpen }) => {
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
        <PanelGroup direction="horizontal">
          <>
            <Panel
              id="idb-crud-side-panel"
              defaultSize={15}
              minSize={10}
              order={1}
            >
              <Sidebar
                selectedDatabase={selectedDatabase}
                setSelectedDatabase={setSelectedDatabase}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
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

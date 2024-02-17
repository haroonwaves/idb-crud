import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect } from "preact/hooks";
import { createRef } from "preact";

import Main from "./Main/main";
import Editor from "./Editor/editor";

import "./styles/drawer.scss";

const Drawer = ({ open, setOpen }) => {
  const idbCrudDrawerRef = createRef();

  useEffect(() => {
    if (open) {
      idbCrudDrawerRef.current.focus();
    } else {
      idbCrudDrawerRef.current.blur();
    }
  }, [open]);

  return (
    <div
      ref={idbCrudDrawerRef}
      className={`idb-crud-drawer ${open ? "open" : ""}`}
      tabIndex={-1} // focusable
      // onBlur={() => setOpen(false)}
    >
      <PanelGroup direction="vertical">
        <>
          <Panel id="idb-crud-main-panel" minSize={10} order={1}>
            <Main />
          </Panel>
          <PanelResizeHandle
            className="idb-crud-panel-resizer"
            style={styles.resizeHandler}
          />
        </>
        <Panel
          id="idb-crud-editor-panel"
          defaultSize={25}
          minSize={25}
          order={2}
        >
          <Editor />
        </Panel>
      </PanelGroup>
    </div>
  );
};

const styles = {
  resizeHandler: {
    height: "2px",
    background: "#e2e8f0",
  },
};

export default Drawer;

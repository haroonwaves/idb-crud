import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Main from "./Main/main";
import Editor from "./Editor/editor";

import "./styles/drawer.scss";

const Drawer = ({ open }) => {
  return (
    <div className={`idb-crud-drawer ${open ? "open" : ""}`}>
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
    background: "#d1d5db",
  },
};

export default Drawer;

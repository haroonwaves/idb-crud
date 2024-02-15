import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Sidebar from "./Sidebar/sidebar";
import Table from "./Table/table";

const Main = () => {
  return (
    <>
      <PanelGroup direction="horizontal">
        <>
          <Panel
            id="idb-crud-side-panel"
            defaultSize={15}
            minSize={10}
            order={1}
          >
            <Sidebar />
          </Panel>
          <PanelResizeHandle
            className="idb-crud-panel-resizer"
            style={styles.resizeHandler}
          />
        </>
        <Panel id="idb-crud-table-panel" minSize={40} order={2}>
          <Table />
        </Panel>
      </PanelGroup>
    </>
  );
};

const styles = {
  resizeHandler: {
    width: "2px",
    background: "#d1d5db",
  },
};

export default Main;

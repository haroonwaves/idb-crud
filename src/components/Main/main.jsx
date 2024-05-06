import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useCallback, useState } from "preact/hooks";
import Table from "./Table/table";
import Editor from "./Editor/editor";
import ReviewModal from "./review-modal";
import appState from "../../AppState/appSate";

const Main = () => {
  const selectedDatabase = appState.selectedDatabase.value;
  const selectedTable = appState.selectedTable.value;

  return (
    <>
      <ReviewModal />
      <PanelGroup direction="vertical">
        <>
          <Panel id="idb-crud-table-panel" minSize={30} order={1}>
            {selectedTable && selectedDatabase ? (
              <Table
                selectedDatabase={selectedDatabase}
                selectedTable={selectedTable}
              />
            ) : (
              <div
                className="idb-crud-text-center"
                style={{ color: "#94a3b8" }}
              >
                Select a table to view
              </div>
            )}
          </Panel>
          <PanelResizeHandle
            className="idb-crud-panel-resizer"
            style={styles.resizeHandler}
          />
        </>
        <Panel
          id="idb-crud-editor-panel"
          defaultSize={15}
          minSize={10}
          order={2}
        >
          <Editor />
        </Panel>
      </PanelGroup>
    </>
  );
};

const styles = {
  resizeHandler: {
    height: "2px",
    background: "#e2e8f0",
  },
};

export default Main;

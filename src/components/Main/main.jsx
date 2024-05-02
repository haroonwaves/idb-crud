import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useCallback, useState } from "preact/hooks";
import Table from "./Table/table";
import Editor from "./Editor/editor";
import ReviewModal from "./review-modal";
import appState from "../../AppState/appSate";

const Main = () => {
  const [selectedRows, setSelectedRows] = useState(null);
  const [addedRow, setAddedRow] = useState(null);
  const [refreshAfterEdit, setRefreshAfterEdit] = useState(false);

  const selectedDatabase = appState.selectedDatabase.value;
  const selectedTable = appState.selectedTable.value;

  const onAfterEdit = useCallback(() => {
    setRefreshAfterEdit(true);
  }, [setRefreshAfterEdit]);

  return (
    <>
      <ReviewModal />
      <PanelGroup direction="vertical">
        <>
          <Panel id="idb-crud-table-panel" minSize={30} order={1}>
            {selectedTable && selectedDatabase ? (
              <Table
                selectedRows={selectedRows}
                refreshAfterEdit={refreshAfterEdit}
                setSelectedRows={setSelectedRows}
                setAddedRow={setAddedRow}
                setRefreshAfterEdit={setRefreshAfterEdit}
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
          <Editor
            selectedRows={addedRow || selectedRows}
            onAfterEdit={onAfterEdit}
          />
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

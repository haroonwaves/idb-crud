import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { createContext } from "preact";
import { useCallback, useState } from "preact/hooks";

import Table from "./Table/table";
import Editor from "./Editor/editor";

const initialState = {
  selectedDatabase: null,
  selectedTable: null,
};

const AppState = createContext(initialState);

const Main = ({ selectedDatabase, selectedTable }) => {
  const [selectedRows, setSelectedRows] = useState(null);
  const [addedRow, setAddedRow] = useState(null);
  const [refreshAfterEdit, setRefreshAfterEdit] = useState(false);

  const onAfterEdit = useCallback(() => {
    setRefreshAfterEdit(true);
  }, [setRefreshAfterEdit]);

  return (
    <AppState.Provider value={initialState}>
      <PanelGroup direction="vertical">
        <>
          <Panel id="idb-crud-table-panel" minSize={30} order={1}>
            {selectedTable && selectedDatabase ? (
              <Table
                selectedDatabase={selectedDatabase}
                selectedTable={selectedTable}
                selectedRows={selectedRows}
                refreshAfterEdit={refreshAfterEdit}
                setSelectedRows={setSelectedRows}
                setAddedRow={setAddedRow}
                setRefreshAfterEdit={setRefreshAfterEdit}
              />
            ) : (
              <div className="idb-crud-text-center">Select a table to view</div>
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
            selectedDatabase={selectedDatabase}
            selectedTable={selectedTable}
            onAfterEdit={onAfterEdit}
          />
        </Panel>
      </PanelGroup>
    </AppState.Provider>
  );
};

const styles = {
  resizeHandler: {
    height: "2px",
    background: "#e2e8f0",
  },
};

export default Main;

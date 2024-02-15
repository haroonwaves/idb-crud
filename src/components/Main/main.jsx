import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { createContext } from "preact";
import { useState } from "preact/hooks";

import Sidebar from "./Sidebar/sidebar";
import Table from "./Table/table";

const initialState = {
  selectedDatabase: null,
  selectedTable: null,
};

const AppState = createContext(initialState);

const Main = () => {
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <AppState.Provider value={initialState}>
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
        <Panel id="idb-crud-table-panel" minSize={40} order={2}>
          {selectedTable && selectedDatabase ? (
            <Table
              selectedDatabase={selectedDatabase}
              selectedTable={selectedTable}
            />
          ) : (
            <div className="idb-crud-text-center">Select a table to view</div>
          )}
        </Panel>
      </PanelGroup>
    </AppState.Provider>
  );
};

const styles = {
  resizeHandler: {
    width: "2px",
    background: "#d1d5db",
  },
};

export default Main;

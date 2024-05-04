import { signal } from "@preact/signals";

const selectedDatabase = signal("");
const selectedTable = signal("");
const tableData = signal([]);
const selectedRows = signal([]);

const appState = {
  selectedDatabase,
  selectedTable,
  tableData,
  selectedRows,
};

export default appState;

import { signal } from "@preact/signals";

const selectedDatabase = signal("");
const selectedTable = signal("");
const tableData = signal([]);
const selectedRows = signal([]);
const selectedColumns = signal([]);
const query = signal({
  filter: {},
  sort: [],
  page: 0,
});

const appState = {
  selectedDatabase,
  selectedTable,
  tableData,
  selectedRows,
  selectedColumns,
  query,
};

export default appState;

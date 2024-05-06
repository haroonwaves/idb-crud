import appState from "../../../../AppState/appSate";
import dexieDatabase, { getIndexedColumns } from "../../../../dexie/dexie";
import createPlaceholderObject from "../../Utils/create-placeholder-object";
import loadData from "./load-data";

export async function onAdd() {
  const firstItem = appState.tableData.value[0];
  const selectedDatabase = appState.selectedDatabase.value;
  const selectedTable = appState.selectedTable.value;
  const selectedRows = appState.selectedRows.value;
  const { primaryKeys, secondaryKeys } = getIndexedColumns();

  if (selectedRows.length > 0) appState.selectedRows.value = [];

  let newRow = {};

  if (firstItem) {
    newRow = createPlaceholderObject(firstItem);
  } else {
    const columns = [];
    if (primaryKeys.length > 0) columns.push(...primaryKeys);
    if (secondaryKeys.length > 0) columns.push(...secondaryKeys);

    for (const column of columns) {
      if (column) newRow[column] = "placeholder";
    }
  }

  await dexieDatabase
    .select(selectedDatabase)
    .table(selectedTable)
    .insert(newRow);

  appState.query.value.filter = { [primaryKeys[0]]: "placeholder" };
  appState.query.value.page = 0;
  await loadData(true);
  appState.selectedRows.value = [0];
}

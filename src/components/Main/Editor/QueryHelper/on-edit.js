import appState from "../../../../AppState/appSate";
import { showToast } from "../../../../Toast/toast-manager";
import dexieDatabase from "../../../../dexie/dexie";
import loadData from "../../Table/QueryHealper/load-data";

async function replace(existingValues, newValues) {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  const selectedTable = dexieDatabase.select(dbName).table(tableName);
  const primaryKey = Array.isArray(selectedTable.primaryKey)
    ? selectedTable.primaryKey[0]
    : selectedTable.primaryKey;

  for (const oldValue of existingValues) {
    const key = primaryKey || Object.keys(oldValue)[0];
    const value = oldValue[key];
    await selectedTable.where({ [key]: value }).delete();
  }

  await selectedTable.insert(newValues);
}

export default async function onEdit({ existing_src, updated_src, namespace }) {
  const existingRows = [];
  const updatedRows = [];

  for (const index of namespace) {
    const existingRow = existing_src[index];
    const updatedRow = updated_src[index];
    if (existingRow) existingRows.push(existingRow);
    if (updatedRow) updatedRows.push(updatedRow);
  }

  try {
    await replace(existingRows, updatedRows);

    showToast({
      message: "Update success",
      type: "success",
    });

    return loadData();
  } catch {
    showToast({
      message: "Update failed",
      type: "failure",
    });
  }
}

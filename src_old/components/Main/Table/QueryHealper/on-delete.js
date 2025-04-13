import appState from "../../../../AppState/appSate";
import { showToast } from "../../../../Toast/toast-manager";
import getSelectedValues from "../../../../Utils/get-selected-values";
import dexieDatabase from "../../../../dexie/dexie";
import loadData from "./load-data";

export async function onDelete() {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;
  const selectedValues = getSelectedValues();

  const selectedTable = dexieDatabase.select(dbName).table(tableName);
  const primaryKey = Array.isArray(selectedTable.primaryKey)
    ? selectedTable.primaryKey[0]
    : selectedTable.primaryKey;

  const promises = [];

  for (const value of selectedValues) {
    const key = primaryKey || Object.keys(value)[0];
    const promise = selectedTable.where({ [key]: value[key] }).delete();
    promises.push(promise);
  }

  try {
    await Promise.all(promises);

    appState.selectedRows.value = [];
    await loadData(true);
    showToast({ message: "Delete success", type: "success" });
  } catch {
    showToast({ message: "Delete failed", type: "failure" });
  }
}

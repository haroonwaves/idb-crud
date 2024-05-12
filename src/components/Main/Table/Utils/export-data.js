import appState from "../../../../AppState/appSate";
import { showToast, updateToast } from "../../../../Toast/toast-manager";
import dexieDatabase from "../../../../dexie/dexie";
import {
  disableUserInteraction,
  enableUserInteraction,
} from "../../../Common/overlay";

export default async function exportData() {
  const id = showToast({ message: "Exporting", type: "loading" });
  disableUserInteraction("app");

  const link = document.createElement("a");
  let url = null;

  try {
    const selectedDatabase = appState.selectedDatabase.value;
    const selectedTable = appState.selectedTable.value;

    const data = await dexieDatabase
      .select(selectedDatabase)
      .table(selectedTable)
      .toArray();

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    url = URL.createObjectURL(blob);

    link.href = url;
    link.download = `${selectedTable}.json`;
    document.body.appendChild(link);
    link.click();

    updateToast({ id, message: "Export success", type: "success" });
  } catch (error) {
    updateToast({ id, message: "Export failed", type: "failure" });
    throw error;
  } finally {
    if (document.contains(link)) document.body.removeChild(link);
    URL.revokeObjectURL(url);
    enableUserInteraction("app");
  }
}

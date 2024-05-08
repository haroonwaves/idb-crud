import appState from "../../../../AppState/appSate";
import { showToast } from "../../../../Toast/toast-manager";
import dexieDatabase from "../../../../dexie/dexie";

export default async function exportData() {
  try {
    const selectedDatabase = appState.selectedDatabase.value;
    const selectedTable = appState.selectedTable.value;

    const data = await dexieDatabase
      .select(selectedDatabase)
      .table(selectedTable)
      .toArray();

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTable}.json`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({ message: "Export success", type: "success" });
  } catch (error) {
    showToast({ message: "Export failed", type: "failure" });
    throw error;
  }
}

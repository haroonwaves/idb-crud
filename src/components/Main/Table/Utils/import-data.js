import appState from "../../../../AppState/appSate";
import { showToast, updateToast } from "../../../../Toast/toast-manager";
import dexieDatabase from "../../../../dexie/dexie";
import loadData from "../QueryHealper/load-data";

export default async function importData() {
  const id = showToast({ message: "Importing", type: "loading" });

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.style.display = "none";

  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadDataToIndexedDb(file);
        await loadData(true);
        updateToast({ id, message: "Import success", type: "success" });
      } catch (error) {
        if (error.name === "DataError") {
          updateToast({
            id,
            message: "Invalid data",
            type: "failure",
          });
          return;
        }

        updateToast({ id, message: "Import failed", type: "failure" });
        throw error;
      } finally {
        document.body.removeChild(fileInput);
      }
    }
  };

  document.body.appendChild(fileInput);
  fileInput.click();
}

async function uploadDataToIndexedDb(file) {
  const jsonData = await readFileAsText(file);
  const data = JSON.parse(jsonData);

  const selectedDatabase = appState.selectedDatabase.value;
  const selectedTable = appState.selectedTable.value;

  await dexieDatabase
    .select(selectedDatabase)
    .table(selectedTable)
    .insert(data);
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

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

    const jsonStream = createJSONStream(data);
    const arrayBuffer = await streamToArrayBuffer(jsonStream);
    const blob = new Blob([arrayBuffer], { type: "application/json" });
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

function createJSONStream(data) {
  const jsonStream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode("[\n"));

      data.forEach((item, index) => {
        let jsonString = JSON.stringify(item, null, 2);

        // Add additional indentation to each line except the first and last
        jsonString = jsonString
          .split("\n")
          .map((line) => {
            return "  " + line;
          })
          .join("\n");

        if (index < data.length - 1) {
          jsonString += ",";
        }

        jsonString += "\n"; // Add newline after each object
        controller.enqueue(encoder.encode(jsonString));
      });

      controller.enqueue(encoder.encode("]"));
      controller.close();
    },
  });

  return jsonStream;
}

async function streamToArrayBuffer(stream) {
  const reader = stream.getReader();
  const chunks = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    totalLength += value.length;
  }

  const arrayBuffer = new ArrayBuffer(totalLength);
  const uint8Array = new Uint8Array(arrayBuffer);
  let position = 0;

  for (const chunk of chunks) {
    uint8Array.set(chunk, position);
    position += chunk.length;
  }

  return arrayBuffer;
}

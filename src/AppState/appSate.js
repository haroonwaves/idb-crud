import { signal } from "@preact/signals";

const selectedDatabase = signal("");
const selectedTable = signal("");

const appState = {
  selectedDatabase,
  selectedTable,
};

export default appState;

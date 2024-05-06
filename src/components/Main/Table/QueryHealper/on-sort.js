import appState from "../../../../AppState/appSate";
import loadData from "./load-data";

export async function onSort(sortBy) {
  const sortDirection = appState.query.value.sort[1] === "asc" ? "desc" : "asc";
  appState.query.value.sort = [sortBy, sortDirection];

  if (appState.selectedRows.value.length > 0) {
    appState.selectedRows.value = [];
  }

  appState.query.value.page = 0;
  await loadData();
}

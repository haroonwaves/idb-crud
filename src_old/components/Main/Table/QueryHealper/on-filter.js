import appState from "../../../../AppState/appSate";
import { tableRef } from "../table";
import { parseUserInput } from "../Utils/parse-user-input";
import loadData from "./load-data";

let searchTimeOutId = null;

export async function onFilter(key, value) {
  tableRef.current.setLoadingData(true);
  if (searchTimeOutId) clearTimeout(searchTimeOutId);

  const filter = appState.query.value.filter;
  const selectedRows = appState.selectedRows.value;

  if (filter[key] && value === "") {
    delete filter[key];
  } else {
    filter[key] = parseUserInput(value.trim());
  }

  searchTimeOutId = setTimeout(async () => {
    if (selectedRows.length > 0) appState.selectedRows.value = [];
    appState.query.value.page = 0;
    await loadData(true);
    tableRef.current.setLoadingData(false);
  }, 600);
}

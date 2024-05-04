import appState from "../AppState/appSate";

export default function getSelectedValues() {
  const selectedRows = appState.selectedRows.value;
  const tableDate = appState.tableData.value;
  const selectedValues = selectedRows.map((index) => tableDate[index]);

  return selectedValues;
}

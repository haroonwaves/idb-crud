import appState from "../../../../AppState/appSate";
import dexieDatabase, {
  getCount,
  getIndexedColumns,
} from "../../../../dexie/dexie";
import calculateColumnNames from "../Utils/calculate-column-names";
import { tableRef } from "../table";
import { createColumnHelper } from "@tanstack/react-table";

async function getPagedData() {
  const dbName = appState.selectedDatabase.value;
  const tableName = appState.selectedTable.value;

  const query = appState.query.value.filter;
  const page = appState.query.value.page;
  const pageSize = 20;
  const sortBy = appState.query.value.sort[0] ?? undefined;
  const sortDirection = appState.query.value.sort[1] ?? "asc";

  const offset = page * pageSize;
  const selectedTable = dexieDatabase.select(dbName).table(tableName);
  const primaryKey = selectedTable.primaryKey;

  const result = await selectedTable
    .orderBy(
      sortBy ?? (Array.isArray(primaryKey) ? primaryKey[0] : primaryKey),
      sortDirection
    )
    .where(query)
    .offset(offset)
    .limit(pageSize)
    .toArray();

  return result;
}

const columnHelper = createColumnHelper();
export default async function loadData(shouldLoadCount = false) {
  if (shouldLoadCount) tableRef?.current?.setTotalCount(null);

  let newColumnNames = [];
  let existingColumnNames = [];
  const selectedColumns = appState.selectedColumns.value;
  const filter = appState.query.value.filter;

  const previousData = appState.tableData.value;
  const newData = await getPagedData();

  if (newData.length === 0) {
    const { primaryKeys, secondaryKeys } = getIndexedColumns();
    if (primaryKeys.length > 0) newColumnNames.push(...primaryKeys);
    if (secondaryKeys.length > 0) newColumnNames.push(...secondaryKeys);
    newColumnNames.unshift("selection");
    existingColumnNames = newColumnNames;
  } else {
    newColumnNames = calculateColumnNames(newData).flat();
    existingColumnNames = calculateColumnNames(previousData).flat();

    if (newColumnNames.length > 0) newColumnNames.unshift("selection");
    if (existingColumnNames.length > 0)
      existingColumnNames.unshift("selection");
  }

  const updatedColumns = newColumnNames.map((columnName) => {
    if (columnName === "selection") {
      return {
        Header: "",
        id: "selection",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      };
    }
    return columnHelper.accessor(columnName, {
      cell: (info) => {
        const value = info.getValue();
        const maxLength = 100;

        // Check if the value is an object or a boolean and convert to string
        if (typeof value === "object" || typeof value === "boolean") {
          const stringValue = JSON.stringify(value);
          // Truncate the string if it exceeds the maximum length
          return stringValue.length > maxLength
            ? stringValue.substring(0, maxLength) + "..."
            : stringValue;
        }

        // For non-object/non-boolean values, convert to string.
        const stringValue = String(value);

        // Truncate the string if it exceeds the maximum length
        return stringValue.length > maxLength
          ? stringValue.substring(0, maxLength) + "..."
          : stringValue;
      },
    });
  });

  if (newData.length === 0 && Object.keys(filter).length > 0) {
    // Don't reset column if filter is applied and no data is returned
  } else {
    tableRef?.current?.setColumns(updatedColumns);

    if (
      selectedColumns.length === 0 ||
      updatedColumns.length < existingColumnNames.length
    ) {
      appState.selectedColumns.value = newColumnNames.slice(1);
    } else if (updatedColumns.length > existingColumnNames.length) {
      const addedColumns = newColumnNames
        .slice(1)
        .filter((column) => !existingColumnNames.includes(column));

      appState.selectedColumns.value = Array.from(
        new Set([...selectedColumns, ...addedColumns])
      );
    }
  }

  appState.tableData.value = newData;
  tableRef?.current?.setLoadingTable(false);

  if (shouldLoadCount) getCount().then(tableRef?.current?.setTotalCount);
}

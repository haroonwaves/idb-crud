import { useEffect, useRef, useState } from "preact/hooks";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import LoadingSpinner from "../../Common/loading-spinner";
import ControlPanel from "./control-panel";
import appState from "../../../AppState/appSate";
import { getKeyType } from "./Utils/util";
import { onSort } from "./QueryHealper/on-sort";
import loadData from "./QueryHealper/load-data";
import { onFilter } from "./QueryHealper/on-filter";
import InfoIcon from "../../../icons/info.svg?component";
import ArrowUpAltIcon from "../../../icons/arrow-up-alt.svg?component";
import ArrowDownAltIcon from "../../../icons/arrow-down-alt.svg?component";

import tableStyles from "./Styles/table.scss?inline";

export let tableRef = null;

function IdbCrudTable({ selectedDatabase, selectedTable }) {
  const selectedRows = appState.selectedRows.value;
  const selectedColumns = appState.selectedColumns.value;

  const [columns, setColumns] = useState([]);
  const [totalCount, setTotalCount] = useState(null);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  tableRef = useRef({
    setColumns,
    setTotalCount,
    setLoadingTable,
    setLoadingData,
  });

  useEffect(() => {
    appState.selectedColumns.value = [];
    appState.query.value.filter = {};
    appState.selectedRows.value = [];
    appState.query.value.sort = [];
    appState.query.value.page = 0;

    setLoadingTable(true);
    loadData(true);
  }, [selectedDatabase, selectedTable]);

  const table = useReactTable({
    data: appState.tableData.value,
    columns,
    state: {
      rowSelection: selectedRows.reduce((acc, value) => {
        acc[value] = true;
        return acc;
      }, {}),
    },
    enableRowSelection: true,
    onRowSelectionChange: (fn) => {
      const prevRowSelection = selectedRows.reduce((acc, value) => {
        acc[value] = true;
        return acc;
      }, {});
      const newRowSelection = fn(prevRowSelection);

      appState.selectedRows.value = Object.keys(newRowSelection);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <style>{tableStyles}</style>
      <ControlPanel columns={columns} totalItems={totalCount} />
      <div className="idb-crud-table-container">
        {loadingTable ? (
          <LoadingSpinner />
        ) : (
          <table className="idb-crud-table">
            <thead className="idb-crud-table-header">
              {table.getHeaderGroups().map((headerGroup) => {
                const visibleHeaders = headerGroup.headers.filter((header) => {
                  if (header.id === "selection") return true;
                  return selectedColumns.includes(header.id);
                });

                return (
                  <tr className="idb-crud-table-row" key={headerGroup.id}>
                    {visibleHeaders.map((header, index) => {
                      const sortDirection =
                        appState.query.value.sort[0] === header.id &&
                        appState.query.value.sort[1];
                      const keyType = getKeyType(header.id);

                      return (
                        <th className="idb-crud-table-head" key={header.id}>
                          {header.isPlaceholder ? null : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "7px",
                              }}
                            >
                              <div className="idb-crud-table-head-name">
                                {header.id === "selection" ||
                                !keyType ? null : (
                                  <span title={keyType}>
                                    <InfoIcon className="ignore-default-style" />
                                  </span>
                                )}

                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.id === "selection" ? null : (
                                  <div
                                    className="idb-crud-table-head-name-sort"
                                    onClick={() => onSort(header.id)}
                                  >
                                    <ArrowDownAltIcon
                                      className={`idb-crud-table-head-name-sort-icon ignore-default-style ${
                                        sortDirection === "desc" ? "active" : ""
                                      }`}
                                    />
                                    <ArrowUpAltIcon
                                      className={`idb-crud-table-head-name-sort-icon ignore-default-style ${
                                        sortDirection === "asc" ? "active" : ""
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>
                              {index > 0 && (
                                <input
                                  onChange={(e) =>
                                    onFilter(header.id, e.target.value)
                                  }
                                  value={appState.query.value.filter[header.id]}
                                  type="text"
                                  placeholder="Search..."
                                />
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody className="idb-crud-table-body">
              {table.getRowModel().rows.map((row) => {
                const visibleCells = row.getVisibleCells().filter((cell) => {
                  if (cell.column.id === "selection") return true;
                  return selectedColumns.includes(cell.column.id);
                });

                return (
                  <tr className="idb-crud-table-row" key={row.id}>
                    {visibleCells.map((cell) => {
                      const cellValue = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      );
                      const filterValue =
                        appState.query.value.filter[cell.column.id];

                      return (
                        <td
                          className={`idb-crud-table-data ${
                            filterValue &&
                            filterValue === cellValue.props.renderValue()
                              ? "font-semibold"
                              : ""
                          }`}
                          key={cell.id}
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {appState.tableData.value.length === 0 && (
          <div className="idb-crud-text-center !h-1/2">No content</div>
        )}
      </div>
    </>
  );
}

export default IdbCrudTable;

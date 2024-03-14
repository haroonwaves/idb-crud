import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  deleteData,
  getCount,
  getIndexedColumns,
  getPagedData,
} from "../../../dexie/dexie";
import calculateColumnNames from "./Utils/calculate-column-names";
import LoadingSpinner from "../../Common/loading-spinner";
import ControlPanel from "./control-panel";
import createPlaceholderObject from "../Editor/create-placeholder-object";
import { showToast } from "../../../Toast/toast-manager";
import { parseUserInput } from "./Utils/parse-user-input";
import CrossIcon from "../../../icons/cross-small.svg?component";

import tableStyles from "./Styles/table.scss?inline";

const columnHelper = createColumnHelper();

const itemsPerPage = 20;
let searchTimeOutId = null;

function IdbCrudTable({
  selectedDatabase,
  selectedTable,
  selectedRows,
  setAddedRow,
  setSelectedRows,
  setRefreshAfterEdit,
  refreshAfterEdit,
}) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [totalCount, setTotalCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const filter = useRef({});
  const sort = useRef([]);
  const resetRef = useRef({
    selectedColumns: false,
    filter: false,
    sort: false,
    rowSelection: false,
    count: false,
  });

  const setPagedData = useCallback(
    (data) => {
      let columnNames = [];

      if (data.length === 0) {
        const { primaryKey, secondaryKeys = [] } = getIndexedColumns(
          selectedDatabase,
          selectedTable
        );

        if (primaryKey) {
          const primaryKeys = Array.isArray(primaryKey)
            ? [...primaryKey]
            : [primaryKey];
          columnNames.push(...primaryKeys.flat());
        }
        if (secondaryKeys.length > 0) {
          columnNames.push(...secondaryKeys.flat().filter(Boolean));
        }
      } else {
        columnNames = calculateColumnNames(data).flat();
      }

      if (columnNames.length > 0) columnNames.unshift("selection");

      const allColumns = columnNames.map((columnName) => {
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
            if (typeof value === "object" || typeof value === "boolean") {
              return JSON.stringify(value);
            }

            return value;
          },
        });
      });
      if (data.length === 0 && Object.keys(filter.current).length > 0) {
        // Don't reset column if filter is applied and no data is returned
      } else {
        setColumns(allColumns);
        if (
          resetRef.current.selectedColumns ||
          allColumns.length < columns.length
        ) {
          setSelectedColumns(columnNames.slice(1));
        } else if (allColumns.length > columns.length) {
          const existingColumns = columns.map(({ accessorKey }) => accessorKey);
          const addedColumns = columnNames
            .slice(1)
            .filter((column) => !existingColumns.includes(column));

          setSelectedColumns([...selectedColumns, ...addedColumns]);
        }
      }
      setData(data);

      return data;
    },
    [
      setColumns,
      setData,
      setSelectedColumns,
      selectedColumns,
      filter,
      columns,
      selectedDatabase,
      selectedTable,
    ]
  );

  const onPageChange = useCallback(
    (page) => {
      setCurrentPage(page);

      if (resetRef.current.rowSelection) {
        setRowSelection({});
        setSelectedRows(null);
      }

      if (resetRef.current.filter) {
        filter.current = {};
      }

      if (resetRef.current.count) {
        setTotalCount(null);
      }

      if (resetRef.current.sort) {
        sort.current = [];
      }

      getPagedData(
        selectedDatabase,
        selectedTable,
        filter.current,
        page,
        itemsPerPage,
        sort.current[0],
        sort.current[1]
      )
        .then(setPagedData)
        .then(() => {
          setLoadingTable(false);
          if (resetRef.current.count) {
            getCount(selectedDatabase, selectedTable, filter.current).then(
              setTotalCount
            );
          }

          resetRef.current.selectedColumns = false;
          resetRef.current.filter = false;
          resetRef.current.rowSelection = false;
          resetRef.current.count = false;
          resetRef.current.sort = false;
        });
    },
    [
      setSelectedRows,
      selectedTable,
      selectedDatabase,
      totalCount,
      sort,
      filter,
      setTotalCount,
      setPagedData,
      setLoadingTable,
      setRowSelection,
    ]
  );

  const onAdd = useCallback(() => {
    const firstItem = data?.[0];
    setRowSelection([]);

    if (firstItem) {
      setAddedRow(createPlaceholderObject(firstItem));
    } else {
      const newRow = {};
      for (const { accessorKey } of columns) {
        if (accessorKey) {
          newRow[accessorKey] = "placeholder";
        }
      }
      setAddedRow(newRow);
    }
  }, [data, setAddedRow, setSelectedRows]);

  const onDelete = useCallback(() => {
    deleteData(selectedDatabase, selectedTable, selectedRows)
      .then(() => {
        resetRef.current.rowSelection = true;
        resetRef.current.count = true;
        onPageChange(currentPage);
        showToast({ message: "Delete success", type: "success" });
      })
      .catch(() => showToast({ message: "Delete failed", type: "failure" }));
  }, [
    selectedDatabase,
    selectedTable,
    selectedRows,
    currentPage,
    onPageChange,
  ]);

  const onColumnsSelect = useCallback(
    (selectedColumns) => {
      setSelectedColumns(selectedColumns);
    },
    [setSelectedColumns]
  );

  const handleFilter = (key, value) => {
    setLoadingData(true);
    if (searchTimeOutId) clearTimeout(searchTimeOutId);

    if (filter.current[key] && value === "") {
      delete filter.current[key];
    } else {
      filter.current[key] = parseUserInput(value.trim());
    }

    searchTimeOutId = setTimeout(() => {
      resetRef.current.rowSelection = true;
      resetRef.current.count = true;
      onPageChange(0);
      setLoadingData(false);
    }, 600);
  };

  const handleSort = useCallback(
    (sortBy) => {
      const sortDirection = sort.current[1] === "asc" ? "desc" : "asc";
      sort.current = [sortBy, sortDirection];

      resetRef.current.rowSelection = true;
      onPageChange(0);
    },
    [sort, onPageChange]
  );

  const syncData = useCallback(() => {
    resetRef.current.count = true;
    onPageChange(currentPage);
  }, [currentPage, selectedDatabase, selectedTable, columns]);

  useEffect(() => {
    resetRef.current.selectedColumns = true;
    resetRef.current.filter = true;
    resetRef.current.rowSelection = true;
    resetRef.current.count = true;
    resetRef.current.sort = true;

    setLoadingTable(true);
    setAddedRow(null);
    onPageChange(0);
  }, [selectedDatabase, selectedTable]);

  useEffect(() => {
    const newSelectedRows = Object.keys(rowSelection).map(
      (index) => data[index]
    );
    if (newSelectedRows?.length > 0) {
      setAddedRow(null);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows(null);
    }
  }, [rowSelection]);

  useEffect(() => {
    if (refreshAfterEdit) {
      onPageChange(currentPage);
      setRefreshAfterEdit(false);
    }
  }, [refreshAfterEdit]);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <style>{tableStyles}</style>
      <ControlPanel
        columns={columns}
        selectedColumns={selectedColumns}
        selectedItems={selectedRows}
        totalItems={totalCount}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          resetRef.current.rowSelection = true;
          onPageChange(page);
        }}
        onColumnsSelect={onColumnsSelect}
        onAdd={onAdd}
        onDelete={onDelete}
        syncData={syncData}
      />
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
                    {visibleHeaders.map((header, index) => (
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
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.id === "selection" ? null : (
                                <div
                                  className="idb-crud-table-head-name-sort"
                                  onClick={() => handleSort(header.id)}
                                >
                                  <div
                                    className={`idb-crud-table-head-name-sort-icon ${
                                      sort.current[0] === header.id &&
                                      sort.current[1] === "desc"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    ↓
                                  </div>
                                  <div
                                    className={`idb-crud-table-head-name-sort-icon ${
                                      sort.current[0] === header.id &&
                                      sort.current[1] === "asc"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    ↑
                                  </div>
                                </div>
                              )}
                            </div>
                            {index > 0 && (
                              <div className="relative flex items-center">
                                <input
                                  className="pr-3"
                                  onChange={(e) =>
                                    handleFilter(header.id, e.target.value)
                                  }
                                  type="text"
                                  placeholder="Search..."
                                  value={filter.current[header.id] ?? ""}
                                />
                                {filter.current[header.id] && (
                                  <CrossIcon
                                    className="absolute right-2 cursor-pointer"
                                    onClick={() => {
                                      handleFilter(header.id, "");
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
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
                    {visibleCells.map((cell) => (
                      <td className="idb-crud-table-data" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {data.length === 0 && (
          <div className="idb-crud-text-center !h-1/2">No content</div>
        )}
      </div>
    </>
  );
}

export default IdbCrudTable;

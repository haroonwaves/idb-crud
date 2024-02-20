import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { deleteData, getCount, getPagedData } from "../../../dexie/dexie";
import calculateColumnNames from "./Utils/calculate-column-names";
import LoadingSpinner from "../../Common/loading-spinner";
import ControlPanel from "./control-panel";

import "./Styles/table.scss";

const columnHelper = createColumnHelper();

const itemsPerPage = 20;
let currentPage = 0;
let searchTimeOutId = null;

function IdbCrudTable({
  selectedDatabase,
  selectedTable,
  selectedRows,
  setSelectedRows,
  setRefreshAfterEdit,
  refreshAfterEdit,
}) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [totalCount, setTotalCount] = useState(null);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const filter = useRef({});
  const resetRef = useRef({
    columns: false,
    selectedColumns: false,
    filter: false,
    rowSelection: false,
    count: false,
  });

  const setPagedData = useCallback(
    (data) => {
      const columnNames = calculateColumnNames(data);
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
            if (typeof value === "object") {
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
        if (resetRef.current.selectedColumns)
          setSelectedColumns(columnNames.slice(1));
      }
      return setData(data);
    },
    [setColumns, setData, setSelectedColumns, filter]
  );

  const onPageChange = useCallback(
    (page) => {
      currentPage = page;
      let pageSize;

      if (resetRef.current.rowSelection) {
        setRowSelection({});
        setSelectedRows(null);
      }

      if (resetRef.current.filter) {
        filter.current = {};
      }

      if (resetRef.current.count) {
        setTotalCount(null);
        pageSize = itemsPerPage;
      } else {
        if (page + 1 >= totalCount / itemsPerPage) {
          // Last page
          pageSize = totalCount % itemsPerPage;
        }
      }

      getPagedData(
        selectedDatabase,
        selectedTable,
        filter.current,
        page,
        pageSize
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
          resetRef.current.columns = false;
          resetRef.current.rowSelection = false;
          resetRef.current.count = false;
        });
    },
    [
      setSelectedRows,
      selectedTable,
      selectedDatabase,
      totalCount,
      setTotalCount,
      setLoadingTable,
      setRowSelection,
    ]
  );

  const onDelete = useCallback(() => {
    deleteData(selectedDatabase, selectedTable, selectedRows).then(() => {
      resetRef.current.rowSelection = true;
      resetRef.current.count = true;
      onPageChange(currentPage);
    });
  }, [selectedDatabase, selectedTable, selectedRows, currentPage]);

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
      filter.current[key] = value;
    }

    searchTimeOutId = setTimeout(() => {
      resetRef.current.count = true;
      onPageChange(currentPage);
      setLoadingData(false);
    }, 600);
  };

  useEffect(() => {
    resetRef.current.selectedColumns = true;
    resetRef.current.filter = true;
    resetRef.current.columns = true;
    resetRef.current.rowSelection = true;
    resetRef.current.count = true;

    setLoadingTable(true);
    onPageChange(0);
  }, [selectedDatabase, selectedTable]);

  useEffect(() => {
    const newSelectedRows = Object.keys(rowSelection).map(
      (index) => data[index]
    );
    if (newSelectedRows?.length > 0) {
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
      <ControlPanel
        columns={columns}
        selectedColumns={selectedColumns}
        selectedItems={selectedRows}
        totalItems={totalCount}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          resetRef.current.rowSelection = true;
          onPageChange(page);
        }}
        onColumnsSelect={onColumnsSelect}
        onDelete={onDelete}
      />
      <div className="idb-crud-table-container">
        {loadingTable ? (
          <LoadingSpinner />
        ) : (
          <table className="idb-crud-table">
            <thead className="idb-crud-table-header">
              {table.getHeaderGroups().map((headerGroup) => {
                const visbileHeaders = headerGroup.headers.filter((header) => {
                  if (header.id === "selection") return true;
                  return selectedColumns.includes(header.id);
                });

                return (
                  <tr className="idb-crud-table-row" key={headerGroup.id}>
                    {visbileHeaders.map((header, index) => (
                      <th className="idb-crud-table-head" key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "2px",
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {index > 0 && (
                              <input
                                onChange={(e) =>
                                  handleFilter(header.id, e.target.value)
                                }
                                type="text"
                                placeholder="Search..."
                              />
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
            {columns.length === 0 && (
              <div className="idb-crud-text-center">No content</div>
            )}
          </table>
        )}
      </div>
    </>
  );
}

export default IdbCrudTable;

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

import "./Styles/table.scss";
import ControlPanel from "./control-panel";
import Pagination from "../../Common/pagination";
import MultiSelect from "../../Common/multi-select";

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
  const [rowSelection, setRowSelection] = useState({});
  const [totalCount, setTotalCount] = useState(null);

  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const filter = useRef({});

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
      }
      setData(data);
      return;
    },
    [setColumns, setData, filter]
  );

  const onPageChange = useCallback(
    (page, loadCount = false, clearSelection = true) => {
      currentPage = page;
      let pageSize;

      if (clearSelection) {
        setRowSelection({});
        setSelectedRows(null);
      }

      if (loadCount) {
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
          if (loadCount) {
            getCount(selectedDatabase, selectedTable, filter.current).then(
              setTotalCount
            );
          }
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
      onPageChange(currentPage, true, true);
    });
  }, [selectedDatabase, selectedTable, selectedRows, currentPage]);

  const onColumnsSelect = useCallback(
    (selectedColumns) => {
      const filteredColumns = columns.filter(({ accessorKey }) =>
        selectedColumns.includes(accessorKey)
      );

      setColumns(filteredColumns);
    },
    [columns]
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
      onPageChange(currentPage, true, false);
      setLoadingData(false);
    }, 600);
  };

  useEffect(() => {
    filter.current = {};
    setLoadingTable(true);
    onPageChange(0, true);
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
      onPageChange(currentPage, false, false);
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
        selectedItems={selectedRows}
        totalItems={totalCount}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onColumnsSelect={onColumnsSelect}
        onDelete={onDelete}
      />
      <div className="idb-crud-table-container">
        {loadingTable ? (
          <LoadingSpinner />
        ) : (
          <table className="idb-crud-table">
            <thead className="idb-crud-table-header">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="idb-crud-table-row" key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
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
              ))}
            </thead>
            <tbody className="idb-crud-table-body">
              {table.getRowModel().rows.map((row) => (
                <tr className="idb-crud-table-row" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="idb-crud-table-data" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
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

import { useCallback, useEffect, useState } from "preact/hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { getCount, getPagedData } from "../../../dexie/dexie";
import calculateColumnNames from "./Utils/calculate-column-names";
import LoadingSpinner from "../../Common/loading-spinner";

import "./Styles/table.scss";
import ControlPanel from "./control-panel";

const columnHelper = createColumnHelper();

const itemsPerPage = 20;

function IdbCrudTable({ selectedDatabase, selectedTable }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [totalCount, setTotalCount] = useState(null);

  const [loadingTable, setLoadingTable] = useState(true);

  const setPagedData = useCallback(
    (data) => {
      const columnNames = calculateColumnNames(data);
      if (columnNames.length > 0) columnNames.unshift("selection");

      const columns = columnNames.map((columnName) => {
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
      setColumns(columns);
      setData(data);
      return;
    },
    [setColumns, setData]
  );

  const onPageChange = useCallback(
    (page, loadCount = false) => {
      let pageSize;

      if (loadCount) {
        setTotalCount(null);
        setLoadingTable(true);

        pageSize = itemsPerPage;
      } else {
        if (page + 1 >= totalCount / itemsPerPage) {
          // Last page
          pageSize = totalCount % itemsPerPage;
        }
      }

      getPagedData(selectedDatabase, selectedTable, page, pageSize)
        .then(setPagedData)
        .then(() => {
          if (loadCount) {
            setLoadingTable(false);
            setTotalCount(null);
            getCount(selectedDatabase, selectedTable).then(setTotalCount);
          }
        });
    },
    [
      setTotalCount,
      setLoadingTable,
      selectedTable,
      selectedDatabase,
      totalCount,
    ]
  );

  useEffect(() => {
    console.log("USE EFFECT");
    onPageChange(0, true);
  }, [selectedDatabase, selectedTable]);

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
    <div className="idb-crud-table-container">
      {loadingTable ? (
        <LoadingSpinner />
      ) : (
        <>
          <ControlPanel
            itemsPerPage={itemsPerPage}
            totalItems={totalCount}
            setPage={onPageChange}
          />
          <table className="idb-crud-table">
            <thead className="idb-crud-table-header">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="idb-crud-table-row" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th className="idb-crud-table-head" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
        </>
      )}
    </div>
  );
}

export default IdbCrudTable;

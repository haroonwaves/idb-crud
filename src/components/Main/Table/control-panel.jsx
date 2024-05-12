import Pagination from "../../Common/pagination";
import MultiSelect from "../../Common/multi-select";
import Tooltip from "../../Common/Tooltip";
import appState from "../../../AppState/appSate";
import { onDelete } from "./QueryHealper/on-delete";
import { onAdd } from "./QueryHealper/on-add";
import loadData from "./QueryHealper/load-data";
import exportData from "./Utils/export-data";
import importData from "./Utils/import-data";
import AddIcon from "../../../icons/add.svg?component";
import DeleteIcon from "../../../icons/delete.svg?component";
import ExportIcon from "../../../icons/export.svg?component";
import ImportIcon from "../../../icons/import.svg?component";
import SyncIcon from "../../../icons/sync.svg?component";

import controlPanelStyles from "./Styles/control-panel.scss?inline";

const ControlPanel = ({ columns, totalItems }) => {
  const selectedRowsCount = appState.selectedRows.value.length;

  return (
    <>
      <style>{controlPanelStyles}</style>
      <div className="idb-crud-table-control-panel">
        <div className="idb-crud-table-control-panel-actions">
          <Tooltip text="Refresh table">
            <SyncIcon onClick={loadData} />
          </Tooltip>
          <Tooltip text="Import">
            <ImportIcon onClick={importData} />
          </Tooltip>
          <Tooltip text="Export">
            <ExportIcon onClick={exportData} />
          </Tooltip>
          <Tooltip text="Add record">
            <AddIcon onClick={onAdd} />
          </Tooltip>
          <Tooltip text="Delete record">
            <DeleteIcon
              className={`${selectedRowsCount === 0 ? "disabled" : ""}`}
              onClick={selectedRowsCount > 0 ? onDelete : () => {}}
            />
          </Tooltip>
        </div>
        <Pagination
          loading={totalItems === null}
          totalItems={totalItems}
          onPageChange={(page) => {
            if (appState.selectedRows.value.length > 0) {
              appState.selectedRows.value = [];
            }
            appState.query.value.page = page;
            loadData();
          }}
        />
        <MultiSelect
          placeHolder={"Filter columns"}
          options={columns.slice(1).map((column) => ({
            id: column.accessorKey,
            value: column.accessorKey,
          }))}
          selectedColumns={appState.selectedColumns.value}
          onSelect={(selectedColumns) =>
            (appState.selectedColumns.value = selectedColumns)
          }
        />
      </div>
    </>
  );
};

export default ControlPanel;

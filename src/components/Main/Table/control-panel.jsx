import Pagination from "../../Common/pagination";
import MultiSelect from "../../Common/multi-select";
import AddIcon from "../../../icons/add.svg?component";
import DeleteIcon from "../../../icons/delete.svg?component";
import UploadIcon from "../../../icons/upload.svg?component";
import DownloadIcon from "../../../icons/download.svg?component";
import SyncIcon from "../../../icons/sync.svg?component";

import controlPanelStyles from "./Styles/control-panel.scss?inline";
import Tooltip from "../../Common/Tooltip";

const ControlPanel = ({
  columns,
  selectedColumns,
  selectedItems,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onColumnsSelect,
  onAdd,
  onDelete,
  syncData,
}) => {
  const selectedItemsCount = selectedItems?.length ?? 0;

  return (
    <>
      <style>{controlPanelStyles}</style>
      <div className="idb-crud-table-control-panel">
        <div className="idb-crud-table-control-panel-actions">
          <Tooltip text="Refresh table">
            <SyncIcon onClick={syncData} />
          </Tooltip>
          <Tooltip text="Add record">
            <AddIcon onClick={onAdd} />
          </Tooltip>
          <Tooltip text="Delete record">
            <DeleteIcon
              className={`${selectedItemsCount === 0 ? "disabled" : ""}`}
              onClick={selectedItemsCount > 0 ? onDelete : () => {}}
            />
          </Tooltip>
          <Tooltip text="Upload">
            <UploadIcon className="disabled" />
          </Tooltip>
          <Tooltip text="Download">
            <DownloadIcon className="disabled" />
          </Tooltip>
        </div>
        <Pagination
          loading={totalItems === null}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
        <MultiSelect
          placeHolder={"Filter columns"}
          options={columns.slice(1).map((column) => ({
            id: column.accessorKey,
            value: column.accessorKey,
          }))}
          selectedColumns={selectedColumns}
          onSelect={onColumnsSelect}
        />
      </div>
    </>
  );
};

export default ControlPanel;

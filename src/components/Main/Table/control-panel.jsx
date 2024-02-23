import Pagination from "../../Common/pagination";
import MultiSelect from "../../Common/multi-select";
import AddIcon from "../../../icons/add.svg?component";
import DeleteIcon from "../../../icons/delete.svg?component";
import UploadIcon from "../../../icons/upload.svg?component";
import DownloadIcon from "../../../icons/download.svg?component";
import SyncIcon from "../../../icons/sync.svg?component";

import controlPanelStyles from "./Styles/control-panel.scss?inline";

const ControlPanel = ({
  columns,
  selectedColumns,
  selectedItems,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onColumnsSelect,
  onDelete,
  syncData,
}) => {
  const selectedItemsCount = selectedItems?.length ?? 0;

  return (
    <>
      <style>{controlPanelStyles}</style>
      <div className="idb-crud-table-control-panel">
        <div className="idb-crud-table-control-panel-actions">
          <SyncIcon onClick={syncData} />
          <AddIcon />
          <DeleteIcon
            className={`${selectedItemsCount === 0 ? "disabled" : ""}`}
            onClick={selectedItemsCount > 0 ? onDelete : () => {}}
          />
          <UploadIcon className="disabled" />
          <DownloadIcon className="disabled" />
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

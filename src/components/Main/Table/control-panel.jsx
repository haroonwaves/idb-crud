import Pagination from "../../Common/pagination";
import MultiSelect from "../../Common/multi-select";
import AddIcon from "../../../icons/add.svg?component";
import DeleteIcon from "../../../icons/delete.svg?component";
import UploadIcon from "../../../icons/upload.svg?component";
import DownloadIcon from "../../../icons/download.svg?component";

import "./Styles/control-panel.scss";

const ControlPanel = ({
  columns,
  selectedColumns,
  selectedItems,
  totalItems,
  itemsPerPage,
  onPageChange,
  onColumnsSelect,
  onDelete,
}) => {
  const selectedItemsCount = selectedItems?.length ?? 0;

  return (
    <div className="idb-crud-table-control-panel">
      <MultiSelect
        placeHolder={"Filter columns"}
        options={columns.slice(1).map((column) => ({
          id: column.accessorKey,
          value: column.accessorKey,
        }))}
        selectedColumns={selectedColumns}
        onSelect={onColumnsSelect}
      />
      <div className="idb-crud-table-control-panel-actions">
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
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ControlPanel;

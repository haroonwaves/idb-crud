import Pagination from "../../Common/pagination";
import MultiSelect from "../../Common/multi-select";
import AddIcon from "../../../icons/add.svg?component";
import DeleteIcon from "../../../icons/delete.svg?component";
import UploadIcon from "../../../icons/upload.svg?component";
import DownloadIcon from "../../../icons/download.svg?component";

import "./Styles/control-panel.scss";

const ControlPanel = ({
  columns,
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
      <Pagination
        loading={totalItems === null}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
      <MultiSelect
        placeHolder={"Filter columns"}
        options={columns.map((column) => ({
          id: column.accessorKey,
          value: column.accessorKey,
        }))}
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
    </div>
  );
};

export default ControlPanel;

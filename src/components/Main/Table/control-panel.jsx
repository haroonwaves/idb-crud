import AddIcon from "../../../icons/add.svg?component";
import DeleteIcon from "../../../icons/delete.svg?component";
import UploadIcon from "../../../icons/upload.svg?component";
import DownloadIcon from "../../../icons/download.svg?component";

import "./Styles/control-panel.scss";

const ControlPanel = ({ columns, selectedItems, onDelete }) => {
  const selectedItemsCount = selectedItems?.length ?? 0;

  return (
    <div className="idb-crud-table-control-panel">
      <div className="idb-crud-table-control-panel-filter-columns">
        <select
          name="idb-crud-table-control-panel-filter-columns"
          id="idb-crud-table-control-panel-filter-columns"
        >
          {columns.map((column, i) => (
            <option key={i} value={column.accessorKey}>
              {column.id === "selection"
                ? "Choose columns"
                : column.accessorKey}
            </option>
          ))}
        </select>
      </div>
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

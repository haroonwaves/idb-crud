import Pagination from "../../Common/pagination";
import AddIcon from "../../../icons/add.svg?component";
import DeleteIcon from "../../../icons/delete.svg?component";
import UploadIcon from "../../../icons/upload.svg?component";
import DownloadIcon from "../../../icons/download.svg?component";

import "./Styles/control-panel.scss";

const ControlPanel = ({ itemsPerPage, totalItems, onPageChange, onDelete }) => {
  return (
    <div className="idb-crud-table-control-panel">
      <Pagination
        loading={totalItems === null}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
      <div className="idb-crud-table-control-panel-actions">
        <AddIcon />
        <DeleteIcon onClick={onDelete} />
        <UploadIcon className="disabled" />
        <DownloadIcon />
      </div>
    </div>
  );
};

export default ControlPanel;

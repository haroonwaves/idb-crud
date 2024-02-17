import Pagination from "../../Common/pagination";

import "./Styles/control-panel.scss";

const ControlPanel = ({ itemsPerPage, totalItems, setPage }) => {
  return (
    <div className="idb-crud-table-control-panel">
      <Pagination
        loading={totalItems === null}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setPage(page)}
      />
    </div>
  );
};

export default ControlPanel;

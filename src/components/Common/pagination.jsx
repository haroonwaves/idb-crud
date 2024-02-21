import { useCallback, useEffect, useState } from "preact/hooks";
import ChevronRight from "../../icons/chevron_right.svg?component";
import ChevronLeft from "../../icons/chevron_left.svg?component";

import "./Style/pagination.scss";

const Pagination = ({ totalItems, itemsPerPage, onPageChange, loading }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setCurrentPage(0);
  }, [loading]);

  const handlePageClick = useCallback(
    (page) => {
      if (page < 0 || page >= totalPages || loading) return;
      setCurrentPage(page);
      onPageChange(page);
    },
    [loading, onPageChange, totalPages, setCurrentPage]
  );

  // Calculate the range of items for the current page
  const fromItem = currentPage * itemsPerPage + 1;
  const toItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  return (
    <div className="idb-crud-pagination">
      <div className="idb-crud-pagination-page-info">
        {loading ? "Loading..." : `${fromItem} - ${toItem} of ${totalItems}`}
      </div>
      <div className="idb-crud-pagination-button-group">
        <ChevronLeft
          className={`idb-crud-pagination-previous ${
            currentPage === 0 ? "disabled" : ""
          }`}
          onClick={() => handlePageClick(currentPage - 1)}
        />
        <ChevronRight
          className={`idb-crud-pagination-next ${
            currentPage === totalPages - 1 ? "disabled" : ""
          }`}
          onClick={() => handlePageClick(currentPage + 1)}
        />
      </div>
    </div>
  );
};

export default Pagination;

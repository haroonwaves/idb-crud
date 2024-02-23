import { useCallback, useEffect, useState } from "preact/hooks";
import ChevronRight from "../../icons/chevron_right.svg?component";
import ChevronLeft from "../../icons/chevron_left.svg?component";

import paginationStyles from "./Style/pagination.scss?inline";

const Pagination = ({
  totalItems,
  itemsPerPage,
  onPageChange,
  loading,
  currentPage,
}) => {
  const [page, setPage] = useState(currentPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePageClick = useCallback(
    (page) => {
      if (page < 0 || page >= totalPages || loading) return;
      setPage(page);
      onPageChange(page);
    },
    [loading, onPageChange, totalPages, setPage]
  );

  // Calculate the range of items for the current page
  const fromItem = page * itemsPerPage + 1;
  const toItem = Math.min((page + 1) * itemsPerPage, totalItems);

  return (
    <>
      <style>{paginationStyles}</style>
      <div className="idb-crud-pagination">
        <div className="idb-crud-pagination-button-group">
          <ChevronLeft
            className={`idb-crud-pagination-previous ${
              page === 0 ? "disabled" : ""
            }`}
            onClick={() => handlePageClick(page - 1)}
          />
          <ChevronRight
            className={`idb-crud-pagination-next ${
              page === totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() => handlePageClick(page + 1)}
          />
        </div>
        <div className="idb-crud-pagination-page-info">
          {loading ? "Loading..." : `${fromItem} - ${toItem} of ${totalItems}`}
        </div>
      </div>
    </>
  );
};

export default Pagination;

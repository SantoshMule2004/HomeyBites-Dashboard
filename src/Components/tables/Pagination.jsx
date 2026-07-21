// src/components/tables/Pagination.jsx
//
// Server-driven pagination controls — used by <DataTable /> automatically.
// `page` is 0-based to match your backend's PageResponse.page field;
// page numbers are only converted to 1-based for what's shown on screen.

import "./Table.css";

export default function Pagination({ page, totalPages, totalElements, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const currentPage = page + 1; // 1-based, for display only
  const start = page * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalElements);

  // Show a small sliding window of page numbers so this doesn't get huge
  // on tables with many pages: current page, 1 before/after, first, last.
  const pageNumbers = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pageNumbers.push(p);
    } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
      pageNumbers.push("...");
    }
  }

  return (
    <div className="hb-pagination">
      <span className="hb-pagination__info">
        Showing {start}–{end} of {totalElements}
      </span>

      <div className="hb-pagination__controls">
        <button
          type="button"
          className="hb-pagination__btn"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </button>

        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="hb-pagination__ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`hb-pagination__btn ${
                p === currentPage ? "hb-pagination__btn--active" : ""
              }`}
              onClick={() => onPageChange(p - 1)}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="hb-pagination__btn"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
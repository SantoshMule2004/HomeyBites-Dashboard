// src/components/tables/DataTable.jsx
//
// Generic table shell — matches the orange-header look used across the
// dashboard. Pass it column definitions + data and it handles a sticky
// header (only the rows scroll, not the header) and the empty state.
// Reuse across Menu Items, Tiffin Plans, Orders, Subscriptions, etc.
//
// PAGINATION IS SERVER-DRIVEN — `data` should be exactly the current
// page's `content` array from your backend's PageResponse, not the full
// unfiltered list. DataTable does NOT slice `data` itself anymore; it just
// renders whatever you pass it, and shows pagination controls built from
// the page/totalPages/totalElements you also pass in.
//
// Usage:
//   const [page, setPage] = useState(0); // 0-based, matches PageResponse.page
//
//   // ...fetch effect calls your API with { page, size: PAGE_SIZE, ...filters }
//   // and stores response.content / response.totalPages / response.totalElements
//
//   <DataTable
//     columns={[
//       { key: "name", header: "Name", render: (row) => row.menuName },
//       { key: "price", header: "Price", render: (row) => `₹ ${row.price}` },
//       { key: "actions", header: "Actions", render: (row) => (<button ...>Update</button>) },
//     ]}
//     data={items}                 // response.content for the current page
//     rowKey={(row) => row.menuId}
//     emptyMessage="No menu items match your search/filters."
//     isLoading={loading}
//     page={page}                  // 0-based current page
//     totalPages={totalPages}      // response.totalPages
//     totalElements={totalElements}// response.totalElements
//     pageSize={PAGE_SIZE}
//     onPageChange={setPage}
//   />
//
// If you omit page/totalPages/onPageChange entirely, the table just
// renders `data` with no pagination controls (useful for small,
// un-paginated lists).

import Pagination from "./Pagination";
import LoadingSpinner from "../common/LoadingSpinner";
import "./Table.css";

export default function DataTable({
  columns,
  data,
  rowKey,
  emptyMessage = "No records found.",
  maxBodyHeight, // optional px override; falls back to the CSS default (480px)
  isLoading = false,
  loadingMessage = "Loading...",
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) {
  const showPagination = !isLoading && typeof onPageChange === "function" && totalPages > 1;

  return (
    <div className="hb-card hb-table-card">
      <div
        className="hb-table-scroll"
        style={maxBodyHeight ? { maxHeight: `${maxBodyHeight}px` } : undefined}
      >
        <table className="hb-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <LoadingSpinner message={loadingMessage} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted py-4">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowKey ? rowKey(row) : rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render(row)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
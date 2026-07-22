// src/pages/Admin/AdminListPage.jsx
//
// Generic, reusable READ-ONLY list page shell for admin views where the
// admin can search/filter/paginate but has no create/edit/delete actions —
// Orders, Payments, Subscriptions all use this same shell, configured
// per-entity with columns + filter definitions + a fetch function. It owns
// all the search/filter/date/pagination state and wires it into the same
// FiltersBar / DateFilter / DataTable used everywhere else in the app.
//
// Usage (see AdminOrdersPage.jsx / AdminPaymentsPage.jsx / AdminSubscriptionsPage.jsx):
//   <AdminListPage
//     title="Orders"
//     columns={columns}
//     rowKey={(row) => row.providerOrderId}
//     searchPlaceholder="Search by customer name..."
//     filterDefs={[
//       { key: "status", allLabel: "All Status", options: [...] },
//     ]}
//     fetchFn={(params) => getAdminOrders(params)}
//   />
//
// fetchFn receives { search, ...filterValues, startDate, endDate, page, size }
// (only including whichever of those are actually set) and must resolve
// with a PageResponse: { content, totalPages, totalElements }.

import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../Components/common/PageHeader";
import ErrorState from "../../Components/common/ErrorState";
import FiltersBar from "../../Components/tables/FiltersBar";
import DateFilter from "../../Components/tables/DateFilter";
import DataTable from "../../Components/tables/DataTable";

const PAGE_SIZE_DEFAULT = 8;
const SEARCH_DEBOUNCE_MS = 500;

export default function AdminListPage({
  title,
  columns,
  rowKey,
  searchPlaceholder = "Search...",
  filterDefs = [], // [{ key, allLabel, options }]
  useDateFilter = true,
  pageSize = PAGE_SIZE_DEFAULT,
  emptyMessage = "No records match your search/filters.",
  fetchFn,
}) {

  const today = new Date().toLocaleDateString('en-CA');

  const sevenDaysAgoTarget = new Date();
  sevenDaysAgoTarget.setDate(sevenDaysAgoTarget.getDate() - 7);
  const sevenDaysAgo = sevenDaysAgoTarget.toLocaleDateString('en-CA');

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState(() =>
    Object.fromEntries(filterDefs.map((f) => [f.key, "ALL"]))
  );

  const [dateMode, setDateMode] = useState("TODAY");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = { page, size: pageSize };
    if (search.trim()) params.search = search.trim();
    filterDefs.forEach((f) => {
      if (filterValues[f.key] && filterValues[f.key] !== "ALL") {
        params[f.key] = filterValues[f.key];
      }
    });
    if (useDateFilter) {
      params.startDate = dateMode === "SPECIFIC_DATE" || dateMode === "RANGE" ? fromDate || null : null;
      params.endDate = dateMode === "RANGE" ? toDate || null : null;
    }
    return fetchFn(params)
      .then((response) => {
        setData(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message ? err?.response?.data?.message : "Couldn't load this data. Please check your connection and try again.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, filterValues, dateMode, fromDate, toDate, fetchFn, useDateFilter]);

  // Jump back to page 0 whenever any filter changes — staying on a deep
  // page of a now-much-smaller filtered result would just show empty rows.
  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterValues, dateMode, fromDate, toDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleResetFilters = () => {
    setSearch("");
    setFilterValues(Object.fromEntries(filterDefs.map((f) => [f.key, "ALL"])));
    setDateMode("TODAY");
    setFromDate(today);
    setToDate(today);
  };

  const updateDateMode = (value) => {
    setDateMode(value)
    if (value === "RANGE") {
      setFromDate(sevenDaysAgo)
    } else if (value === "SPECIFIC_DATE") {
      setFromDate(today)
    }
  }

  return (
    <div className="hb-admin-list hb-list-page">
      <PageHeader title={title} />

      {error && <ErrorState message={error} onRetry={fetchData} />}

      <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: searchPlaceholder }}
        filters={filterDefs.map((f) => ({
          key: f.key,
          value: filterValues[f.key],
          onChange: (value) => setFilterValues((prev) => ({ ...prev, [f.key]: value })),
          allLabel: f.allLabel,
          options: f.options,
        }))}
        onReset={handleResetFilters}
      >
        {useDateFilter && (
          <DateFilter
            mode={dateMode}
            onModeChange={updateDateMode}
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        )}
      </FiltersBar>

      <DataTable
        columns={columns}
        data={data}
        rowKey={rowKey}
        emptyMessage={emptyMessage}
        isLoading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}

// src/components/tables/FiltersBar.jsx
//
// Combines a search box with any number of filter dropdowns (and any extra
// custom filter, like <DateFilter />, passed as children) in one row, plus
// an optional "Reset Filters" button. Drop this above any <DataTable />
// across your pages (Menu Items, Tiffin Plans, Orders, Subscriptions, etc.)
// and just pass different config.
//
// Usage:
//   <FiltersBar
//     search={{ value: search, onChange: setSearch, placeholder: "Search orders..." }}
//     filters={[
//       { value: statusFilter, onChange: setStatusFilter, options: ["Pending", "Completed"], allLabel: "All Status" },
//       { value: typeFilter, onChange: setTypeFilter, options: MENU_TYPE_OPTIONS, allLabel: "All Types" },
//     ]}
//     onReset={handleResetFilters}
//   >
//     <DateFilter mode={dateMode} onModeChange={setDateMode} ... />
//   </FiltersBar>

import SearchBar from "./SearchBar";
import FilterSelect from "./FilterSelect";
import "./Table.css";

export default function FiltersBar({ search, filters = [], onReset, children }) {
  return (
    <div className="hb-filters-bar">
      {search && (
        <SearchBar
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
        />
      )}
      {filters.map((filter, index) => (
        <FilterSelect
          key={filter.key ?? index}
          value={filter.value}
          onChange={filter.onChange}
          options={filter.options}
          allLabel={filter.allLabel}
        />
      ))}
      {children}
      {onReset && (
        <button
          type="button"
          className="btn hb-btn-secondary hb-filters-bar__reset"
          onClick={onReset}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}

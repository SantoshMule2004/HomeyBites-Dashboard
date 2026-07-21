// src/components/tables/DateFilter.jsx
//
// Reusable date filter for use inside <FiltersBar />. Lets the user pick a
// mode — no date filter, a single "from" date, or a from/to range — and
// shows exactly the right date input(s) for that mode.
//
// Usage:
//   const [dateMode, setDateMode] = useState("ALL");   // "ALL" | "FROM" | "RANGE"
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//
//   <FiltersBar search={...} filters={[...]}>
//     <DateFilter
//       mode={dateMode}
//       onModeChange={setDateMode}
//       fromDate={fromDate}
//       toDate={toDate}
//       onFromDateChange={setFromDate}
//       onToDateChange={setToDate}
//     />
//   </FiltersBar>

import "./Table.css";

const DATE_MODE_OPTIONS = [
  { label: "Today", value: "TODAY" },
  { label: "Specific Date", value: "SPECIFIC_DATE" },
  // { label: "From Date", value: "FROM" },
  { label: "Date Range", value: "RANGE" },
];

export default function DateFilter({
  mode,
  onModeChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) {
  return (
    <div className="hb-date-filter">
      <select
        className="form-select hb-filter-select"
        value={mode}
        onChange={(e) => onModeChange(e.target.value)}
      >
        {DATE_MODE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {mode === "SPECIFIC_DATE" && (
        <input
          type="date"
          className="form-control hb-date-input"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          aria-label="date"
        />
      )}

      {mode === "RANGE" && (
        <>
          <input
            type="date"
            className="form-control hb-date-input"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            aria-label="From date"
          />
          <span className="hb-date-filter__separator">to</span>
          <input
            type="date"
            className="form-control hb-date-input"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            aria-label="To date"
          />
        </>
      )}
    </div>
  );
}

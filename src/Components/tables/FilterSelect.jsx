// src/components/tables/FilterSelect.jsx
//
// Generic "All X" style filter dropdown — use on its own, or via
// <FiltersBar /> below to combine several at once.
//
// options: array of either plain strings, e.g. ["Veg", "Non-Veg"]
//          or { label, value } objects if the display text and the
//          underlying value need to differ, e.g.
//          [{ label: "Breakfast", value: "BREAKFAST" }]

import "./Table.css";

export default function FilterSelect({ value, onChange, options, allLabel = "All" }) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <select
      className="form-select hb-filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="ALL">{allLabel}</option>
      {normalized.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

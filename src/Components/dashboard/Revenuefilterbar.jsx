// src/components/dashboard/RevenueFilterBar.jsx
//
// Filters just the revenue summary + chart section. groupBy is one of
// DAY / WEEK / MONTH / YEAR / CUSTOM. For the first four, a second control
// lets the user pick one of that group's allowed date-range keys — sent to
// the backend as-is (e.g. "LAST_7_DAYS"); the backend computes the actual
// dates. For CUSTOM, two date inputs replace that control and startDate/
// endDate are sent directly instead.
//
// Each control has a small label above it ("Group By" / "Date Range") so
// it's clear what they do — meant to sit inline next to the section title,
// e.g. <div className="hb-revenue-header"><h5>Revenue</h5><RevenueFilterBar .../></div>
//
// Reports { groupBy, dateRange, startDate, endDate } via onFilterChange
// whenever the user changes something — NOT on mount, since the parent
// already has default revenue data from its main dashboard fetch.

import { useEffect, useRef, useState } from "react";
import "../tables/Table.css";
import "./Dashboard.css";

const GROUP_BY_OPTIONS = ["DAY", "WEEK", "MONTH", "YEAR"];

// Allowed date-range keys per groupBy — sent verbatim to the backend,
// which computes the actual start/end dates for each one.
const PRESETS_BY_GROUP = {
  DAY: ["TODAY", "YESTERDAY", "THIS_WEEK", "LAST_WEEK", "LAST_7_DAYS", "LAST_15_DAYS"],
  WEEK: ["LAST_30_DAYS", "THIS_MONTH", "LAST_MONTH", "LAST_3_MONTHS"],
  MONTH: ["LAST_6_MONTHS", "THIS_YEAR", "LAST_YEAR"],
  YEAR: ["LAST_2_YEARS", "LAST_5_YEARS", "ALL_TIME"],
};

// "LAST_7_DAYS" -> "Last 7 Days"
const formatLabel = (key) =>
  key
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

export default function RevenueFilterBar({ onFilterChange }) {
  const [groupBy, setGroupBy] = useState("DAY");
  const [dateRange, setDateRange] = useState(PRESETS_BY_GROUP.DAY[2]);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const hasMounted = useRef(false);

  const isCustom = groupBy === "CUSTOM";

  const handleGroupByChange = (value) => {
    setGroupBy(value);
    if (value === "CUSTOM") {
      setCustomFrom("");
      setCustomTo("");
    } else {
      setDateRange(PRESETS_BY_GROUP[value][0]);
    }
  };

  useEffect(() => {
    // Skip the very first run (mount) — the parent already has default
    // revenue data from its main dashboard fetch. Only report changes the
    // user actually makes from here on.
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isCustom) {
      onFilterChange({
        groupBy,
        dateRange: null,
        startDate: customFrom || null,
        endDate: customTo || null,
      });
    } else {
      onFilterChange({ groupBy, dateRange, startDate: null, endDate: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, dateRange, customFrom, customTo]);

  return (
    <div className="hb-revenue-filter">
      <div className="hb-revenue-filter__group">
        <label className="hb-revenue-filter__label" htmlFor="revenueGroupBy">
          Group By
        </label>
        <select
          id="revenueGroupBy"
          className="form-select hb-filter-select hb-revenue-filter__select"
          value={groupBy}
          onChange={(e) => handleGroupByChange(e.target.value)}
        >
          {GROUP_BY_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0) + g.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {isCustom ? (
        <div className="hb-revenue-filter__group">
          <label className="hb-revenue-filter__label">Date Range</label>
          <div className="hb-date-filter">
            <input
              type="date"
              className="form-control hb-date-input"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              aria-label="From date"
            />
            <span className="hb-date-filter__separator">to</span>
            <input
              type="date"
              className="form-control hb-date-input"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              aria-label="To date"
            />
          </div>
        </div>
      ) : (
        <div className="hb-revenue-filter__group">
          <label className="hb-revenue-filter__label" htmlFor="revenueDateRange">
            Date Range
          </label>
          <select
            id="revenueDateRange"
            className="form-select hb-filter-select hb-revenue-filter__select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {PRESETS_BY_GROUP[groupBy].map((key) => (
              <option key={key} value={key}>
                {formatLabel(key)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
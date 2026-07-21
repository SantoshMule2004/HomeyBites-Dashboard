// src/components/tables/SearchBar.jsx
//
// Generic search input — use on its own, or via <FiltersBar /> below.

import { FiSearch } from "react-icons/fi";
import "./Table.css";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="hb-search">
      <FiSearch className="hb-search__icon" />
      <input
        type="text"
        className="form-control hb-search__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

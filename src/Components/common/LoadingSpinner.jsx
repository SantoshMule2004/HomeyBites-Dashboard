// src/components/common/LoadingSpinner.jsx
//
// Small reusable spinner + message — used inside <DataTable isLoading />
// automatically, but exported separately for any other loading state
// (page-level loads, button states, etc.)

import "./Common.css";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="hb-loading">
      <span className="hb-loading__spinner" aria-hidden="true" />
      <span className="hb-loading__text">{message}</span>
    </div>
  );
}

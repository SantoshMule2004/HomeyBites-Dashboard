// src/components/common/ErrorState.jsx
//
// Reusable "something went wrong" banner with a retry button — for failed
// API fetches on any page (Menu Items, Tiffin Plans, Orders, etc.)

import "./Common.css";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="hb-error-state">
      <span className="hb-error-state__text">{message}</span>
      {onRetry && (
        <button type="button" className="btn hb-btn-secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

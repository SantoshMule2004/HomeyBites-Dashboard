// src/components/common/DetailModal.jsx
//
// Generic "view details" popup — fetches fresh data every time it opens
// (same pattern as OrderItemsModal), then hands that data to whatever
// `render` function the caller supplies. This lets one modal serve several
// different "view X for this row" cases (a table of items, a summary of
// fields, etc.) without writing a near-identical modal component for each.
//
// Usage:
//   <DetailModal
//     isOpen={!!activeView}
//     title={activeView ? `Menu Items — ${activeView.provider.businessName}` : ""}
//     size="lg"
//     fetchFn={() => getProviderMenuItems(activeView.provider.providerId)}
//     render={(data) => <MenuItemsTable items={data} />}
//     onClose={() => setActiveView(null)}
//   />

import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import "../Modal.css";

export default function DetailModal({ isOpen, title, size = "md", fetchFn, render, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    if (!fetchFn) return;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((response) => setData(response.content))
      .catch((err) => {
        console.error(err);
        setError("Couldn't load this data. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      setData(null);
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="hb-modal-backdrop" onMouseDown={onClose}>
      <div
        className={`hb-modal ${size === "lg" ? "hb-modal--lg" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detailModalTitle"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="hb-modal__header">
          <h5 id="detailModalTitle" className="hb-modal__title">
            {title}
          </h5>
          <button type="button" className="hb-modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="hb-modal__body">
          {loading && <LoadingSpinner message="Loading..." />}
          {!loading && error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && data && render(data)}
        </div>

        <div className="hb-modal__footer">
          <button type="button" className="btn hb-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

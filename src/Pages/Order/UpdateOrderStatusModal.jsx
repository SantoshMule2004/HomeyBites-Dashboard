// src/pages/Orders/UpdateOrderStatusModal.jsx
//
// Small popup — the ONLY thing a provider can change about an order is its
// fulfillment status. No other fields are editable here.

import { useEffect, useState } from "react";
import { ORDER_STATUS_OPTIONS, ORDER_STATUS_META, getStatusMeta } from "../../utils/config";
import "../../components/tables/Table.css";
import "../../components/Modal.css";

export default function UpdateOrderStatusModal({ isOpen, order, onSave, onClose }) {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      setStatus(order.fulfillmentStatus ?? "");
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSave(status);
      setSubmitting(false);
      onClose();
    } catch (err) {
      setSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="hb-modal-backdrop" onMouseDown={onClose}>
      <div
        className="hb-modal hb-modal--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="updateStatusModalTitle"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="hb-modal__header">
          <h5 id="updateStatusModalTitle" className="hb-modal__title">
            Update Order Status
          </h5>
          <button type="button" className="hb-modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="hb-modal__body">
            <p className="text-muted small mb-3">
              Order #{order.providerOrderId} for {order.receiverName}
            </p>

            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {getStatusMeta(ORDER_STATUS_META, option).label}
                </option>
              ))}
            </select>
          </div>

          <div className="hb-modal__footer">
            <button
              type="button"
              className="btn hb-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn hb-btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

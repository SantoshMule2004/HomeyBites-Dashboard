// src/components/common/ConfirmDialog.jsx
//
// Generic yes/no confirmation popup — used for delete/disable actions
// across any page. If you already have a ConfirmModal elsewhere in your
// project, feel free to swap it in instead; this one is self-contained
// so the table components don't depend on anything outside src/components.

import "./ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger", // "danger" | "primary"
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="hb-confirm-backdrop" onMouseDown={onCancel}>
      <div
        className="hb-confirm"
        role="alertdialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h5 className="hb-confirm__title">{title}</h5>
        <p className="hb-confirm__message">{message}</p>
        <div className="hb-confirm__actions">
          <button type="button" className="btn hb-btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${variant === "danger" ? "hb-btn-disable" : "hb-btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

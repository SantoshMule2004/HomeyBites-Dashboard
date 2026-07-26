// src/pages/MenuItems/MenuItemFormModal.jsx
//
// Popup form used for BOTH "Add New Item" and "Update" — pass an existing
// item via `initialData` to prefill it for editing, or omit it to add new.
//
// Validation:
//   menuName   -> required
//   price      -> required, must be a number > 0
//   description-> required
//   menuType   -> required, must pick one
//   categoryId -> required, must pick one (real categories passed in via
//                 the `categories` prop, e.g. [{ categoryId, categoryName }])
//   image      -> required when adding; when a file IS picked (add or
//                 edit), it must be an image type and under 5MB
//   active   -> boolean toggle, defaults to true when adding
//
// On submit, this calls onSave(payload) where payload is the plain field
// values PLUS `imageFile` (a File object, or null) and `categoryId`. The
// parent page is responsible for turning that into the multipart FormData
// your backend expects — see MenuItemsPage.jsx for both the "add with
// image" call and the separate "update image" call used when editing.

import { useEffect, useState } from "react";
import "../../../Components/tables/Table.css";
import "../../../Components/Modal.css";
import "./providers.css";

const emptyForm = {
  closedDate: "",
  name: "",
  description: "",
  isActive: true,
};

export default function ProviderHolidayModal({
  isOpen,
  mode,
  initialData,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Reset / prefill whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData
          ? {
            id: initialData.id,
            closedDate: initialData.closedDate ?? "",
            name: initialData.name ?? "",
            description: initialData.description ?? "",
            isActive: initialData.isActive ?? true,
          }
          : emptyForm
      );
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const next = {};

    if (!form.closedDate.trim()) {
      next.closedDate = "Close date cannot be empty.";
    }

    if (!form.name.trim()) {
      next.name = "Name cannot be empty..!";
    }

    // if (!form.description.trim()) {
    //   next.description = "Description cannot be empty.";
    // }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        ...form,
      });
      setSubmitting(false);
      onClose();
    } catch (err) {
      setSubmitting(false);
      // Let the parent's toast/error handling surface API errors;
      // this just makes sure the button doesn't stay stuck loading.
      console.error(err);
    }
  };

  return (
    <div className="hb-modal-backdrop" onMouseDown={onClose}>
      <div
        className="hb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="holidayModalTitle"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="hb-modal__header">
          <h5 id="holidayModalTitle" className="hb-modal__title">
            {mode === "edit" ? "Update Holiday" : "Add New Holiday"}
          </h5>
          <button
            type="button"
            className="hb-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="hb-modal__body">
            <div className="mb-3">
              <label className="form-label fw-semibold">Holiday Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Republic Day"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows={3}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Short description of the holiday"
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Closed Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.closedDate ? "is-invalid" : ""}`}
                  value={form.closedDate}
                  onChange={(e) => handleChange("closedDate", e.target.value)}
                  // placeholder="e.g. Republic Day"
                  aria-label="From date"
                  disabled={mode === "edit"}
                />
                {errors.closedDate && (
                  <div className="invalid-feedback">{errors.closedDate}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold d-block">Status</label>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="activeSwitch"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="activeSwitch">
                    {form.isActive ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
            </div>
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
              {submitting ? "Saving..." : mode === "edit" ? "Update" : "Add Holiday"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// src/pages/TiffinPlans/TiffinPlanFormModal.jsx
//
// Popup form used for BOTH "Add New Plan" and "Update" — pass an existing
// plan via `initialData` to prefill it for editing, or omit it to add new.
// Submits exactly the shape your CreateTiffinPlanDTO expects: planName,
// validityDays, offersBreakfast/pricePerBreakfast, offersLunch/pricePerLunch,
// offersDinner/pricePerDinner, maxCapacity.
//
// Validation:
//   planName      -> required
//   validityDays  -> required, whole number > 0
//   meals offered -> at least one of Breakfast/Lunch/Dinner must be checked
//   price fields  -> required (> 0) for whichever meal(s) are checked
//   maxCapacity   -> required, whole number > 0
//
// Not in this form: `active` — your backend's create/update DTO doesn't
// include it; status is only ever changed via the Enable/Disable toggle
// endpoint on the table row, not through this form. Also not editable here:
// `providerId`, `activeSubscribers`, and `createdAt` (system-set), and `id`
// (only present when editing).

import { useEffect, useState } from "react";
import "../../../Components/tables/Table.css";
import "../../../Components/Modal.css";

const emptyForm = {
  categoryName: "",
  active: true
};

export default function CategoryFormModal({ isOpen, mode, initialData, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData
          ? {
            categoryId: initialData.categoryId,
            categoryName: initialData.categoryName ?? "",
            active: initialData.active ?? true,
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

  const toggleMeal = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
    if (errors.meals) {
      setErrors((prev) => ({ ...prev, meals: undefined }));
    }
  };

  const validate = () => {
    const next = {};

    if (!form.categoryName.trim()) {
      next.planName = "category name cannot be empty.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { categoryId, ...dtoFields } = form;
      await onSave({
        ...dtoFields,
      });
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
        className="hb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tiffinPlanModalTitle"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="hb-modal__header">
          <h5 id="tiffinPlanModalTitle" className="hb-modal__title">
            {mode === "edit" ? "Update Tiffin Plan" : "Add New Tiffin Plan"}
          </h5>
          <button type="button" className="hb-modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="hb-modal__body">
            <div className="mb-3">
              <label className="form-label fw-semibold">Category Name</label>
              <input
                type="text"
                className={`form-control ${errors.categoryName ? "is-invalid" : ""}`}
                value={form.categoryName}
                onChange={(e) => handleChange("categoryName", e.target.value)}
                placeholder="e.g. Veg"
              />
              {errors.categoryName && <div className="invalid-feedback">{errors.categoryName}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold d-block">Status</label>
              <div className="form-check form-switch mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="activeSwitch"
                  checked={form.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                />
                <label className="form-check-label" htmlFor="activeSwitch">
                  {form.active ? "Active" : "Inactive"}
                </label>
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
              {submitting ? "Saving..." : mode === "edit" ? "Update" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

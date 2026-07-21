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
import "../../Components/tables/Table.css";
import "../../Components/Modal.css";

const emptyForm = {
  planName: "",
  validityDays: "",
  offersBreakfast: false,
  offersLunch: false,
  offersDinner: false,
  pricePerBreakfast: "",
  pricePerLunch: "",
  pricePerDinner: "",
  maxCapacity: "",
};

export default function TiffinPlanFormModal({ isOpen, mode, initialData, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData
          ? {
              id: initialData.id,
              planName: initialData.planName ?? "",
              validityDays: initialData.validityDays ?? "",
              offersBreakfast: initialData.offersBreakfast ?? false,
              offersLunch: initialData.offersLunch ?? false,
              offersDinner: initialData.offersDinner ?? false,
              pricePerBreakfast: initialData.pricePerBreakfast || "",
              pricePerLunch: initialData.pricePerLunch || "",
              pricePerDinner: initialData.pricePerDinner || "",
              maxCapacity: initialData.maxCapacity ?? "",
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

    if (!form.planName.trim()) {
      next.planName = "Plan name cannot be empty.";
    }

    if (form.validityDays === "" || isNaN(form.validityDays) || Number(form.validityDays) <= 0) {
      next.validityDays = "Validity days must be a whole number greater than 0.";
    }

    if (!form.offersBreakfast && !form.offersLunch && !form.offersDinner) {
      next.meals = "Select at least one meal type this plan offers.";
    }

    if (form.offersBreakfast && (form.pricePerBreakfast === "" || Number(form.pricePerBreakfast) <= 0)) {
      next.pricePerBreakfast = "Enter a breakfast price greater than 0.";
    }
    if (form.offersLunch && (form.pricePerLunch === "" || Number(form.pricePerLunch) <= 0)) {
      next.pricePerLunch = "Enter a lunch price greater than 0.";
    }
    if (form.offersDinner && (form.pricePerDinner === "" || Number(form.pricePerDinner) <= 0)) {
      next.pricePerDinner = "Enter a dinner price greater than 0.";
    }

    if (form.maxCapacity === "" || isNaN(form.maxCapacity) || Number(form.maxCapacity) <= 0) {
      next.maxCapacity = "Max capacity must be a whole number greater than 0.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { id, ...dtoFields } = form; // id isn't part of CreateTiffinPlanDTO
      await onSave({
        ...dtoFields,
        validityDays: Number(form.validityDays),
        maxCapacity: Number(form.maxCapacity),
        pricePerBreakfast: form.offersBreakfast ? Number(form.pricePerBreakfast) : 0,
        pricePerLunch: form.offersLunch ? Number(form.pricePerLunch) : 0,
        pricePerDinner: form.offersDinner ? Number(form.pricePerDinner) : 0,
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
              <label className="form-label fw-semibold">Plan Name</label>
              <input
                type="text"
                className={`form-control ${errors.planName ? "is-invalid" : ""}`}
                value={form.planName}
                onChange={(e) => handleChange("planName", e.target.value)}
                placeholder="e.g. Monthly Veg Combo"
              />
              {errors.planName && <div className="invalid-feedback">{errors.planName}</div>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Validity (Days)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={`form-control ${errors.validityDays ? "is-invalid" : ""}`}
                  value={form.validityDays}
                  onChange={(e) => handleChange("validityDays", e.target.value)}
                  placeholder="e.g. 30"
                />
                {errors.validityDays && (
                  <div className="invalid-feedback">{errors.validityDays}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Max Capacity</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={`form-control ${errors.maxCapacity ? "is-invalid" : ""}`}
                  value={form.maxCapacity}
                  onChange={(e) => handleChange("maxCapacity", e.target.value)}
                  placeholder="e.g. 50"
                />
                {errors.maxCapacity && (
                  <div className="invalid-feedback">{errors.maxCapacity}</div>
                )}
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label fw-semibold d-block">Meals Offered</label>
              <div className="d-flex gap-4 flex-wrap">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="offersBreakfast"
                    checked={form.offersBreakfast}
                    onChange={() => toggleMeal("offersBreakfast")}
                  />
                  <label className="form-check-label" htmlFor="offersBreakfast">
                    Breakfast
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="offersLunch"
                    checked={form.offersLunch}
                    onChange={() => toggleMeal("offersLunch")}
                  />
                  <label className="form-check-label" htmlFor="offersLunch">
                    Lunch
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="offersDinner"
                    checked={form.offersDinner}
                    onChange={() => toggleMeal("offersDinner")}
                  />
                  <label className="form-check-label" htmlFor="offersDinner">
                    Dinner
                  </label>
                </div>
              </div>
              {errors.meals && (
                <div className="text-danger small mt-1">{errors.meals}</div>
              )}
            </div>

            {/* Price inputs appear only for whichever meals are checked above */}
            {(form.offersBreakfast || form.offersLunch || form.offersDinner) && (
              <div className="row mt-2">
                {form.offersBreakfast && (
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Price / Breakfast</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-control ${errors.pricePerBreakfast ? "is-invalid" : ""}`}
                        value={form.pricePerBreakfast}
                        onChange={(e) => handleChange("pricePerBreakfast", e.target.value)}
                        placeholder="0.00"
                      />
                      {errors.pricePerBreakfast && (
                        <div className="invalid-feedback">{errors.pricePerBreakfast}</div>
                      )}
                    </div>
                  </div>
                )}

                {form.offersLunch && (
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Price / Lunch</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-control ${errors.pricePerLunch ? "is-invalid" : ""}`}
                        value={form.pricePerLunch}
                        onChange={(e) => handleChange("pricePerLunch", e.target.value)}
                        placeholder="0.00"
                      />
                      {errors.pricePerLunch && (
                        <div className="invalid-feedback">{errors.pricePerLunch}</div>
                      )}
                    </div>
                  </div>
                )}

                {form.offersDinner && (
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Price / Dinner</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-control ${errors.pricePerDinner ? "is-invalid" : ""}`}
                        value={form.pricePerDinner}
                        onChange={(e) => handleChange("pricePerDinner", e.target.value)}
                        placeholder="0.00"
                      />
                      {errors.pricePerDinner && (
                        <div className="invalid-feedback">{errors.pricePerDinner}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
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
              {submitting ? "Saving..." : mode === "edit" ? "Update" : "Add Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

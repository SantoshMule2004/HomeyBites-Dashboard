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
    id: null,
    dayOfWeek: "",
    isActive: true,
    meals: [
        {
            mealType: "BREAKFAST",
            foodItems: "",
        },
        {
            mealType: "LUNCH",
            foodItems: "",
        },
        {
            mealType: "DINNER",
            foodItems: "",
        },
    ],
};

export default function ProviderMenuModal({
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
        if (!isOpen) return;

        if (initialData) {

            const meals = ["BREAKFAST", "LUNCH", "DINNER"].map(type => {
                const existing = initialData.meals?.find(
                    m => m.mealType === type
                );

                return {
                    mealType: type,
                    foodItems: existing?.foodItems ?? ""
                };
            });

            setForm({
                id: initialData.id,
                dayOfWeek: initialData.dayOfWeek,
                isActive: initialData.isActive,
                meals
            });

        } else {

            setForm(emptyForm);
        }

        setErrors({});
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleMealChange = (mealType, value) => {
        setForm(prev => ({
            ...prev,
            meals: prev.meals.map(meal =>
                meal.mealType === mealType
                    ? { ...meal, foodItems: value }
                    : meal
            )
        }));
    };

    const hasChanges = () => {
        if (!initialData) return true;

        // if (form.isActive !== initialData.isActive) {
        //     return true;
        // }

        const initialMeals = Object.fromEntries(
            (initialData.meals ?? []).map((meal) => [
                meal.mealType,
                meal.foodItems?.trim() ?? "",
            ])
        );

        return (form.meals ?? []).some((meal) => {
            const current = meal.foodItems?.trim() ?? "";
            const original = initialMeals[meal.mealType] ?? "";

            return current !== original;
        });
    };

    const validate = () => {

        const next = {};

        const hasMeal = form.meals.some(
            meal => meal.foodItems.trim() !== ""
        );

        if (!hasMeal) {
            next.meals = "Please add at least one meal.";
        }

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
                        {mode === "edit" ? "Update Menu" : "Add New Menu"}
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
                            <label className="form-label fw-semibold">Day of week</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                value={form.dayOfWeek}
                                // onChange={(e) => handleChange("name", e.target.value)}
                                disabled
                            />
                            {errors.name && (
                                <div className="invalid-feedback">{errors.name}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            {form.meals.map(meal => (
                                <div
                                    className="mb-3"
                                    key={meal.mealType}
                                >

                                    <label className="form-label fw-semibold">
                                        {meal.mealType.charAt(0) +
                                            meal.mealType.slice(1).toLowerCase()}
                                    </label>

                                    <textarea
                                        rows={2}
                                        className="form-control"
                                        value={meal.foodItems}
                                        onChange={e =>
                                            handleMealChange(
                                                meal.mealType,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Enter ${meal.mealType.toLowerCase()} menu`}
                                    />

                                </div>
                            ))}
                        </div>

                        {/* <div className="row">
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
                        </div> */}
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
                        <button type="submit" className="btn hb-btn-primary" disabled={submitting || !hasChanges()}>
                            {submitting ? "Saving..." : mode === "edit" ? "Update" : "Add Meal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
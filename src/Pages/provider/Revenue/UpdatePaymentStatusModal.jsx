// src/pages/Orders/UpdatePaymentStatusModal.jsx

import { useEffect, useState } from "react";
import {
    UPDATE_PAYMENT_STATUS_OPTIONS,
    UPDATE_PAYMENT_STATUS_META,
    getStatusMeta,
} from "../../../utils/config";
import "../../../Components/tables/Table.css";
import "../../../Components/Modal.css";

const emptyForm = {
    status: "",
    failedReason: "",
};

export default function UpdatePaymentStatusModal({
    isOpen,
    order,
    onSave,
    onClose,
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && order) {
            setForm({
                status: order.paymentStatus ?? "",
                failedReason: "",
            });
            setErrors({});
        }
    }, [isOpen, order]);

    if (!isOpen || !order) return null;

    const handleChange = (field, value) => {
        setForm((prev) => {
            const next = {
                ...prev,
                [field]: value,
            };

            // Clear failed reason if status is changed to anything except FAILED
            if (field === "status" && value !== "FAILED") {
                next.failedReason = "";
            }

            return next;
        });

        if (errors[field] || (field === "status" && errors.failedReason)) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
                ...(field === "status" && value !== "FAILED"
                    ? { failedReason: undefined }
                    : {}),
            }));
        }
    };

    const validate = () => {
        const next = {};

        if (form.status === "FAILED" && !form.failedReason.trim()) {
            next.failedReason = "Failed reason cannot be empty.";
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
                paymentStatus: form.status,
                failedReason:
                    form.status === "FAILED"
                        ? form.failedReason.trim()
                        : null,
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
                className="hb-modal hb-modal--sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="updatePaymentStatusModalTitle"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="hb-modal__header">
                    <h5
                        id="updatePaymentStatusModalTitle"
                        className="hb-modal__title"
                    >
                        Update Payment Status
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
                        <p className="text-muted small mb-3">
                            Payment #{order.paymentId} for {order.customerName}
                        </p>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                Status
                            </label>

                            <select
                                className="form-select"
                                value={form.status}
                                onChange={(e) =>
                                    handleChange("status", e.target.value)
                                }
                            >
                                {UPDATE_PAYMENT_STATUS_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {
                                            getStatusMeta(
                                                UPDATE_PAYMENT_STATUS_META,
                                                option
                                            ).label
                                        }
                                    </option>
                                ))}
                            </select>
                        </div>

                        {form.status === "FAILED" && (
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Failure Reason
                                </label>

                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.failedReason
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={form.failedReason}
                                    onChange={(e) =>
                                        handleChange(
                                            "failedReason",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Customer cancelled"
                                />

                                {errors.failedReason && (
                                    <div className="invalid-feedback">
                                        {errors.failedReason}
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

                        <button
                            type="submit"
                            className="btn hb-btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
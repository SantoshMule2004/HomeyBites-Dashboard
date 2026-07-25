// src/pages/Orders/OrderItemsModal.jsx
//
// Read-only popup showing an order's items + summary. Fetches the full
// order detail (including orderItems) from the detail endpoint each time
// it's opened, rather than trusting whatever was in the list row — the
// list endpoint may or may not include the full items array.

import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../Components/common/LoadingSpinner";
import ErrorState from "../../../../Components/common/ErrorState";
import StatusBadge from '../../../../Components/tables/StatusBadge';
import "../../../../Components/tables/Table.css";
import "../../../../Components/Modal.css";
import "./ProviderDetails.css";
import { getUserDetails } from "../../../../Services/userService";

export default function ProviderDetailsModal({ isOpen, providerId, onClose }) {
    const [providerDetails, setProviderDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProviderDetails = () => {
        if (!providerId) return;

        setLoading(true);
        setError(null);
        getUserDetails(providerId)
            .then((response) => {
                setProviderDetails(response);
            })
            .catch((err) => {
                console.error(err);
                setError("Couldn't load provider details. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (isOpen) {
            setProviderDetails(null);
            fetchProviderDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="hb-modal-backdrop" onMouseDown={onClose}>
            <div
                className="hb-modal hb-modal--lg"
                role="dialog"
                aria-modal="true"
                aria-labelledby="orderItemsModalTitle"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="hb-modal__header">
                    <h5 id="orderItemsModalTitle" className="hb-modal__title">
                        Provider #{providerId}
                    </h5>
                    <button type="button" className="hb-modal__close" onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                <div className="hb-modal__body">
                    {loading && <LoadingSpinner message="Loading provider details..." />}

                    {!loading && error && <ErrorState message={error} onRetry={fetchProviderDetails} />}

                    {!loading && !error && providerDetails && (
                        <>
                            <div className="hb-order-summary">
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Owner</span>
                                    <span>
                                        {providerDetails?.firstName}  {providerDetails?.lastName}
                                    </span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Business Name</span>
                                    <span>
                                        {providerDetails?.businessName}
                                    </span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Email</span>
                                    <span>
                                        {providerDetails?.emailId}
                                    </span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Phone</span>
                                    <span>
                                        +91 {providerDetails?.phoneNo}
                                    </span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Status</span>
                                    <span>
                                        <StatusBadge
                                            label={providerDetails?.active ? "Active" : "Inactive"}
                                            variant={providerDetails?.active ? "success" : "danger"}
                                        />
                                    </span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Joined</span>
                                    <span>{providerDetails?.createdAt ? new Date(providerDetails?.createdAt).toLocaleDateString() : "—"}</span>
                                </div>
                            </div>

                            <div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Address</span>
                                    <span>{providerDetails?.addressLine},  {providerDetails?.area}</span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Location</span>
                                    <span>
                                        {providerDetails?.latitude}, {providerDetails?.longitude}
                                    </span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">Service Radius</span>
                                    <span>{Number(providerDetails?.serviceRadius) / 1000} km</span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">FSSAI License No.</span>
                                    <span>{providerDetails?.foodLicenseNo}</span>
                                </div>
                                <div className="hb-order-summary__row">
                                    <span className="hb-order-summary__label">GSTIN</span>
                                    <span>{providerDetails?.gstin || <span className="text-muted">—</span>}</span>
                                </div>
                            </div>
                        </>
                    )}
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

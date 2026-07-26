// src/pages/TiffinPlans/TiffinPlansPage.jsx
//
// Table-based Tiffin Plans page, built from the same reusable pieces as
// Menu Items (src/Components/tables/ + src/Components/common/), wired to
// your real TiffinPlan endpoints the same way MenuItemsPage is.
//
// Per your earlier request: no image column, no menuType/category filters,
// no meal-offered filters, no date filter — just Search + a Status filter
// + Reset.
//
// ⚠️ Note on "Delete": your DELETE endpoint just calls
// togglePlanStatus(providerId, planId, false) — i.e. it's a soft delete
// that deactivates the plan rather than removing it. After confirming
// delete here, the plan will reappear in the list as "Inactive" (not
// vanish), same as if you'd hit Disable. That's expected given your
// current backend implementation — let me know if you add a real hard
// delete later and I'll adjust the UI (e.g. drop the Delete button in
// favor of just Enable/Disable).

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import FiltersBar from "../../../Components/tables/FiltersBar";
import DataTable from "../../../Components/tables/DataTable";
import StatusBadge from "../../../Components/tables/StatusBadge";
import ErrorState from "../../../Components/common/ErrorState";
import { guessStatusVariant } from "../../../utils/statusVariant";
import "./Subscriptions.css";
import { useUserInfo } from "../../../Context/UserContext";
import { getUserSubscriptions } from "../../../Services/subscriptionService";
import { SUB_STATUS_META, SUB_STATUS_OPTIONS } from "../../../utils/config";
import { getStatusMeta } from "../../../utils/config";
import { formatPrice } from "../../../utils/formatPrice";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../../../utils/constants";

export default function SubscriptionsPage() {
    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();
    const providerId = user?.userId;

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // planId currently being updated/enabled/disabled/deleted — disables just
    // that row's action buttons instead of freezing the whole table.
    const [processingId, setProcessingId] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Server-driven pagination — `page` is 0-based, matching PageResponse.page
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
    const [editingPlan, setEditingPlan] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    // --- Fetch tiffin plans from the server, respecting current filters + page ---
    const fetchSubscriptions = useCallback(() => {
        if (!providerId) return Promise.resolve();

        const filters = {
            status: statusFilter === "ALL" ? null : statusFilter,
            search: search.trim() === "" ? null : search.trim(),
        };

        setLoading(true);
        setError(null);

        // 👇 Extend getTiffinPlansOfProvider in TiffinPlanService.js to accept
        // page/size and pass them through as query params.
        return getUserSubscriptions(providerId, filters, page, PAGE_SIZE)
            .then((response) => {
                setSubscriptions(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            })
            .catch((err) => {
                console.error(err);
                setError("Couldn't load user subscriptions. Please check your connection and try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [providerId, statusFilter, search, page]);

    // Whenever a filter changes, jump back to page 0.
    useEffect(() => {
        setPage(0);
    }, [search, statusFilter]);

    // Debounced — covers the first load too, no separate "on mount" fetch needed.
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSubscriptions();
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [fetchSubscriptions]);

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    const openAddModal = () => {
        setModalMode("add");
        setEditingPlan(null);
        setModalOpen(true);
    };

    const openEditModal = (plan) => {
        setModalMode("edit");
        setEditingPlan(plan);
        setModalOpen(true);
    };

    // formData here is a CreateTiffinPlanDTO shape: planName, validityDays,
    // offersBreakfast/pricePerBreakfast, offersLunch/pricePerLunch,
    // offersDinner/pricePerDinner, maxCapacity. No isActive — your backend
    // manages that only through the toggle endpoint, not create/update.
    const handleSave = async (formData) => {
        try {
            if (modalMode === "edit") {
                const response = await updateTiffinPlan(editingPlan.id, providerId, formData);
                toast.success(response?.message ?? "Tiffin plan updated successfully..!");
            } else {
                const response = await addTiffinPlan(providerId, formData);
                toast.success(response?.message ?? "Tiffin plan created successfully..!");
            }
            await fetchSubscriptions();
        } catch (err) {
            console.error(err);
            // Your backend returns 409 with a specific "already exists" message
            // for duplicate plan names — surface it if present, else a generic one.
            const serverMessage = err?.response?.data?.message;
            toast.error(serverMessage || "Couldn't save this tiffin plan. Please try again.");
            throw err;
        }
    };

    const toggleStatus = async (planId, isActive) => {
        setProcessingId(planId);
        try {
            await toggleTiffinPlan(providerId, planId, !isActive);
            toast.success(isActive ? "Tiffin plan deactivated." : "Tiffin plan activated.");
            await fetchSubscriptions();
        } catch (err) {
            console.error(err);
            toast.error("Couldn't update status. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const confirmDelete = async () => {
        const target = deleteTarget;
        setDeleteTarget(null);
        setProcessingId(target.id);
        try {
            await deleteTiffinPlan(target.id, providerId);
            toast.success("Tiffin plan deleted successfully..!");
            await fetchSubscriptions();
        } catch (err) {
            console.error(err);
            toast.error("Couldn't delete this plan. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    // --- Column config for the generic <DataTable /> ---
    const columns = [
        {
            key: "subscriber",
            header: "Subscriber",
            render: (sub) => (
                <>
                    <div className="hb-table__name">{sub.customerName}</div>
                    <div className="hb-table__desc">{sub.phoneNo} - {sub.emailId}</div>
                </>)
        },
        {
            key: "planName",
            header: "Plan Name",
            render: (sub) => <div className="hb-table__name">{sub.planName}</div>,
        },
        {
            key: "validity",
            header: "Validity",
            render: (sub) => `${sub.validityDays} days`,
        },
        {
            key: "meals",
            header: "Meals Included",
            render: (sub) => (
                <div className="hb-meal-badges">
                    <span className={`hb-meal-badge ${sub.includesBreakfast ? "hb-meal-badge--on" : ""}`}>
                        B
                    </span>
                    <span className={`hb-meal-badge ${sub.includesLunch ? "hb-meal-badge--on" : ""}`}>
                        L
                    </span>
                    <span className={`hb-meal-badge ${sub.includesDinner ? "hb-meal-badge--on" : ""}`}>
                        D
                    </span>
                </div>
            ),
        },
        {
            key: "pricing",
            header: "Pricing",
            render: (sub) => (
                <div className="hb-table__desc">
                    {sub.includesBreakfast && <div>B: {formatPrice(sub.breakfastPrice)}</div>}
                    {sub.includesLunch && <div>L: {formatPrice(sub.lunchPrice)}</div>}
                    {sub.includesDinner && <div>D: {formatPrice(sub.dinnerPrice)}</div>}
                </div>
            ),
        },
        {
            key: "startDate",
            header: "Start Date",
            render: (sub) => {
                const startDate = sub.startDate ? new Date(sub.startDate) : null;
                return (startDate) ? (
                    <>
                        <div>{startDate.toLocaleDateString()}</div>
                        {/* <div className="hb-table__desc">{date.toLocaleTimeString()}</div> */}
                    </>
                ) : (
                    "—"
                );
            },
        },
        {
            key: "endDate",
            header: "End Date",
            render: (sub) => {
                const endDate = sub.currentEndDate ? new Date(sub.currentEndDate) : null;
                return (endDate) ? (
                    <>
                        <div>{endDate.toLocaleDateString()}</div>
                        {/* <div className="hb-table__desc">{endDate.toLocaleDateString()}</div> */}
                    </>
                ) : (
                    "—"
                );
            },
        },
        {
            key: "status",
            header: "Status",
            render: (sub) => (
                <StatusBadge label={sub.status} variant={guessStatusVariant(sub.status)} />
            ),
        },
        // {
        //     key: "actions",
        //     header: "Actions",
        //     render: (plan) => (
        //         <div className="hb-table__actions">
        //             <TableActionButton
        //                 variant="update"
        //                 icon={FaEdit}
        //                 iconOnly
        //                 label="Update"
        //                 onClick={() => openEditModal(plan)}
        //                 disabled={processingId === plan.id}
        //             />
        //             {plan.active ? (
        //                 <TableActionButton
        //                     variant="disable"
        //                     icon={MdBlock}
        //                     iconOnly
        //                     label="Disable"
        //                     onClick={() => toggleStatus(plan.id, plan.active)}
        //                     disabled={processingId === plan.id}
        //                 />
        //             ) : (
        //                 <TableActionButton
        //                     variant="enable"
        //                     icon={MdCheckCircle}
        //                     iconOnly
        //                     label="Enable"
        //                     onClick={() => toggleStatus(plan.id, plan.active)}
        //                     disabled={processingId === plan.id}
        //                 />
        //             )}
        //             <TableActionButton
        //                 variant="delete"
        //                 icon={FaTrash}
        //                 iconOnly
        //                 label="Delete"
        //                 onClick={() => setDeleteTarget(plan)}
        //                 disabled={processingId === plan.id}
        //             />
        //         </div>
        //     ),
        // },
    ];

    return (
        <div className="hb-tiffinplans hb-list-page">
            <div className="hb-tiffinplans__header">
                <h1 className="hb-tiffinplans__title">User Subscriptions</h1>
                {/* <button type="button" className="btn hb-btn-primary" onClick={openAddModal}>
                    <FaPlus className="me-2" /> Add New Plan
                </button> */}
            </div>

            {error && <ErrorState message={error} onRetry={fetchSubscriptions} />}

            <FiltersBar
                search={{ value: search, onChange: setSearch, placeholder: "Search subscriptions..." }}
                filters={[
                    {
                        key: "status",
                        value: statusFilter,
                        onChange: setStatusFilter,
                        allLabel: "All Status",
                        options: SUB_STATUS_OPTIONS.map((status) => ({
                            label: getStatusMeta(SUB_STATUS_META, status).label,
                            value: status,
                        })),
                    },
                ]}
                onReset={handleResetFilters}
            />

            <DataTable
                columns={columns}
                data={subscriptions}
                rowKey={(sub) => sub.id}
                emptyMessage="No subscriptions match your search/filters."
                isLoading={loading}
                loadingMessage="Loading user subscriptions..."
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
            />

            {/* <TiffinPlanFormModal
                isOpen={modalOpen}
                mode={modalMode}
                initialData={editingPlan}
                onSave={handleSave}
                onClose={() => setModalOpen(false)}
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete tiffin plan"
                message={`Are you sure you want to delete "${deleteTarget?.planName}"? This can't be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            /> */}
        </div>
    );
}

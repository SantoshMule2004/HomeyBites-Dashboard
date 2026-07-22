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
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdBlock, MdCheckCircle } from "react-icons/md";
import { toast } from "react-toastify";
import FiltersBar from "../../../Components/tables/FiltersBar";
import DataTable from "../../../Components/tables/DataTable";
import StatusBadge from "../../../Components/tables/StatusBadge";
import TableActionButton from "../../../Components/tables/TableActionButton";
import ConfirmDialog from "../../../Components/common/ConfirmDialog";
import ErrorState from "../../../Components/common/ErrorState";
import { guessStatusVariant } from "../../../utils/statusVariant";
import "./Customers.css";
import { useUserInfo } from "../../../Context/UserContext";
import {
    getTiffinPlansOfProvider,
    addTiffinPlan,
    updateTiffinPlan,
    toggleTiffinPlan,
    deleteTiffinPlan,
} from "../../../Services/tiffinPlanService";
import { getUserSubscriptions } from "../../../Services/subscriptionService";
import { SUB_STATUS_META, SUB_STATUS_OPTIONS } from "../../../utils/config";
import { getStatusMeta } from "../../../utils/config";
import { getAllUsers } from "../../../Services/userService";

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 500;

export default function CustomersPage() {
    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();
    const providerId = user?.userId;

    const [customers, setCustomers] = useState([]);
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
    const fetchCustomers = useCallback(() => {
        if (!providerId) return Promise.resolve();

        const filters = {
            userRole: "ROLE_NORMAL_USER",
            search: search.trim() === "" ? null : search.trim(),
        };

        setLoading(true);
        setError(null);

        // 👇 Extend getTiffinPlansOfProvider in TiffinPlanService.js to accept
        // page/size and pass them through as query params.
        return getAllUsers(filters, page, PAGE_SIZE)
            .then((response) => {
                setCustomers(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            })
            .catch((err) => {
                console.error(err);
                setError(err?.response?.data?.message ? err?.response?.data?.message : "Couldn't load customers. Please check your connection and try again.");
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
            fetchCustomers();
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [fetchCustomers]);

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
            await fetchCustomers();
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
            await fetchCustomers();
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
            await fetchCustomers();
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
            key: "name",
            header: "Customer Name",
            render: (sub) => (
                <>
                    <div className="hb-table__name">{sub.firstName} {sub.lastName}</div>
                    {/* <div className="hb-table__desc">{sub.phoneNo} - {sub.emailId}</div> */}
                </>)
        },
        {
            key: "emailId",
            header: "Email Id",
            render: (sub) => sub.emailId,
        },
        {
            key: "phoneNo",
            header: "Phone No.",
            render: (sub) => <div className="hb-table__desc"> +91{sub.phoneNo}</div>,
        },
        {
            key: "dob",
            header: "Dob",
            render: (sub) => (
                sub.dob ? new Date(sub.dob).toLocaleDateString() : "—"
            ),
        },
        {
            key: "gender",
            header: "Gender",
            render: (sub) => (
                sub.gender ? sub.gender : "—"
            ),
        },
        // {
        //     key: "status",
        //     header: "Status",
        //     render: (item) => (
        //         <StatusBadge
        //             label={item.active ? "Active" : "Inactive"}
        //             variant={item.active ? "success" : "danger"}
        //         />
        //     ),
        // },
    ];

    return (
        <div className="hb-tiffinplans hb-list-page">
            <div className="hb-tiffinplans__header">
                <h1 className="hb-tiffinplans__title">Customers</h1>
                {/* <button type="button" className="btn hb-btn-primary" onClick={openAddModal}>
                    <FaPlus className="me-2" /> Add New Plan
                </button> */}
            </div>

            {error && <ErrorState message={error} onRetry={fetchCustomers} />}

            <FiltersBar
                search={{ value: search, onChange: setSearch, placeholder: "Search customers..." }}
                onReset={handleResetFilters}
            />

            <DataTable
                columns={columns}
                data={customers}
                rowKey={(sub) => sub.id}
                emptyMessage="No customers match your search/filters."
                isLoading={loading}
                loadingMessage="Loading customers..."
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

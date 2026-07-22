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

import FiltersBar from '../../../Components/tables/FiltersBar';
import DataTable from "../../../Components/tables/DataTable";
import StatusBadge from "../../../Components/tables/StatusBadge";
import TableActionButton from "../../../Components/tables/TableActionButton";
import ConfirmDialog from "../../../Components/common/ConfirmDialog";
import ErrorState from "../../../Components/common/ErrorState";
import PageHeader from "../../../Components/common/PageHeader";
import CategoryFormModal from "./CategoryFormModal";
import "./Categories.css";
import { useUserInfo } from "../../../Context/UserContext";
import {
    getTiffinPlansOfProvider,
    addTiffinPlan,
    updateTiffinPlan,
    toggleTiffinPlan,
    deleteTiffinPlan,
} from "../../../Services/tiffinPlanService";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../../../Services/menuService";

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 500;

export default function CategoriesPage() {
    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();
    const providerId = user?.userId;

    const [categories, setCategories] = useState([]);
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
    const [editingCategory, setEditingCategory] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    // --- Fetch tiffin plans from the server, respecting current filters + page ---
    const fetchCategories = useCallback(() => {
        if (!providerId) return Promise.resolve();

        const filters = {
            active: statusFilter === "ALL" ? null : statusFilter === "ACTIVE",
            search: search.trim() === "" ? null : search.trim(),
        };

        setLoading(true);
        setError(null);

        // 👇 Extend getTiffinPlansOfProvider in TiffinPlanService.js to accept
        // page/size and pass them through as query params.
        return getAllCategories()
            .then((response) => {
                setCategories(response);
                // setTotalPages(response.totalPages);
                // setTotalElements(response.totalElements);
            })
            .catch((err) => {
                console.error(err);
                setError("Couldn't load your tiffin plans. Please check your connection and try again.");
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
            fetchCategories();
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [fetchCategories]);

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    const openAddModal = () => {
        setModalMode("add");
        setEditingCategory(null);
        setModalOpen(true);
    };

    const openEditModal = (plan) => {
        setModalMode("edit");
        setEditingCategory(plan);
        setModalOpen(true);
    };

    // formData here is a CreateTiffinPlanDTO shape: planName, validityDays,
    // offersBreakfast/pricePerBreakfast, offersLunch/pricePerLunch,
    // offersDinner/pricePerDinner, maxCapacity. No active — your backend
    // manages that only through the toggle endpoint, not create/update.
    const handleSave = async (formData) => {
        try {
            if (modalMode === "edit") {
                const response = await updateCategory(editingCategory.categoryId, formData);
                toast.success(response?.message ?? "Category updated successfully..!");
            } else {
                const response = await addCategory(formData);
                toast.success(response?.message ?? "Category created successfully..!");
            }
            await fetchCategories();
        } catch (err) {
            console.error(err);
            // Your backend returns 409 with a specific "already exists" message
            // for duplicate plan names — surface it if present, else a generic one.
            const serverMessage = err?.response?.data?.message;
            toast.error(serverMessage || "Couldn't save this category. Please try again.");
            throw err;
        }
    };

    const toggleStatus = async (category) => {
        setProcessingId(category.categoryId);
        try {
            await updateCategory(category.categoryId, { categoryName: category.categoryName, active: !category.active });
            toast.success(category.active ? "Category deactivated." : "Category activated.");
            await fetchCategories();
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
        setProcessingId(target.categoryId);
        try {
            await deleteCategory(target.categoryId);
            toast.success("category deleted successfully..!");
            await fetchCategories();
        } catch (err) {
            console.error(err);
            toast.error("Couldn't delete this category. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    // --- Column config for the generic <DataTable /> ---
    const columns = [
        {
            key: "Id",
            header: "caegory Id",
            render: (plan) => `#${plan.categoryId}`,
        },
        {
            key: "categoryName",
            header: "Category Name",
            render: (plan) => <div className="hb-table__name">{plan.categoryName}</div>,
        },
        {
            key: "status",
            header: "Status",
            render: (plan) => (
                <StatusBadge
                    label={plan.active ? "Active" : "Inactive"}
                    variant={plan.active ? "success" : "danger"}
                />
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (plan) => (
                <div className="hb-table__actions">
                    <TableActionButton
                        variant="update"
                        icon={FaEdit}
                        iconOnly
                        label="Update"
                        onClick={() => openEditModal(plan)}
                        disabled={processingId === plan.categoryId}
                    />
                    {plan.active ? (
                        <TableActionButton
                            variant="disable"
                            icon={MdBlock}
                            iconOnly
                            label="Disable"
                            onClick={() => toggleStatus(plan)}
                            disabled={processingId === plan.categoryId}
                        />
                    ) : (
                        <TableActionButton
                            variant="enable"
                            icon={MdCheckCircle}
                            iconOnly
                            label="Enable"
                            onClick={() => toggleStatus(plan)}
                            disabled={processingId === plan.categoryId}
                        />
                    )}
                    <TableActionButton
                        variant="delete"
                        icon={FaTrash}
                        iconOnly
                        label="Delete"
                        onClick={() => setDeleteTarget(plan)}
                        disabled={processingId === plan.categoryId}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="hb-tiffinplans hb-list-page">
            <PageHeader
                title="Categories"
                action={
                    <button type="button" className="btn hb-btn-primary" onClick={openAddModal}>
                        <FaPlus className="me-2" /> Add New Category
                    </button>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchCategories} />}

            {/* <FiltersBar
                search={{ value: search, onChange: setSearch, placeholder: "Search categories..." }}
                filters={[
                    {
                        key: "status",
                        value: statusFilter,
                        onChange: setStatusFilter,
                        allLabel: "All Status",
                        options: [
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" },
                        ],
                    },
                ]}
                onReset={handleResetFilters}
            /> */}

            <DataTable
                columns={columns}
                data={categories}
                rowKey={(plan) => plan.id}
                emptyMessage="No categories match your search/filters."
                isLoading={loading}
                loadingMessage="Loading categories..."
            />

            <CategoryFormModal
                isOpen={modalOpen}
                mode={modalMode}
                initialData={editingCategory}
                onSave={handleSave}
                onClose={() => setModalOpen(false)}
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete category  "
                message={`Are you sure you want to delete "${deleteTarget?.categoryName}"? This can't be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}

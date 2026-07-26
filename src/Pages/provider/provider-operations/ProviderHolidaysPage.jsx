// src/pages/MenuItems/MenuItemsPage.jsx
//
// Table-based Menu Items page, built from the reusable pieces in
// src/Components/tables/ (FiltersBar, DataTable, StatusBadge,
// TableActionButton, Pagination) and src/Components/common/ (ConfirmDialog,
// LoadingSpinner, ErrorState) — the same Components you can reuse on
// Tiffin Plans, Orders, Subscriptions, etc.

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdBlock, MdCheckCircle } from "react-icons/md";
import { toast } from "react-toastify";
import DataTable from "../../../Components/tables/DataTable";
import StatusBadge from "../../../Components/tables/StatusBadge";
import TableActionButton from "../../../Components/tables/TableActionButton";
import ConfirmDialog from "../../../Components/common/ConfirmDialog";
import ErrorState from "../../../Components/common/ErrorState";
import ProviderHolidayModal from "./ProviderHolidayModal";
import "./providers.css";
import { useUserInfo } from "../../../Context/UserContext";
import { useMenuItems } from "../../../Context/MenuItemContext";
import { addProviderHoliday, deleteProviderHoliday, getAllHolidays, toggleProviderHolidayStatus, updateProviderHoliday } from "../../../Services/providerHolidayService";
import PageHeader from "../../../Components/common/PageHeader";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../../../utils/constants";

export default function ProviderHolidaysPage() {
  const [providerHolidays, setProviderHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // menuId currently being updated/enabled/disabled/deleted — disables just
  // that row's action buttons instead of freezing the whole table.
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Server-driven pagination — `page` is 0-based, matching PageResponse.page
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingItem, setEditingItem] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const { getUserInfo } = useUserInfo();
  const { getcategories } = useMenuItems();

  const user = getUserInfo();
  const categories = getcategories();

  // --- Fetch menu items from the server, respecting current filters + page ---
  const fetchProviderHolidays = useCallback(() => {
    if (!user?.userId) return Promise.resolve();

    const filters = { page, size: PAGE_SIZE }
    setLoading(true);
    setError(null);

    // 👇 Extend getMenuItemsOfProvider in MenuService.js to accept page/size
    // and pass them through as query params (Spring's Pageable reads them
    // as ?page=0&size=4 by default).
    return getAllHolidays(filters)
      // user.userId,
      // menuType,
      // searchText,
      // categoryId,
      // isActive,
      // page,
      // PAGE_SIZE
      // )
      .then((response) => {
        setProviderHolidays(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your holidays. Please check your connection and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.userId, typeFilter, statusFilter, categoryFilter, search, page]);

  // Whenever a filter changes, jump back to page 0 — staying on, say, page 3
  // of a now-much-smaller filtered result would just show an empty page.
  useEffect(() => {
    setPage(0);
  }, [search, typeFilter, categoryFilter, statusFilter]);

  // Debounced: re-fetches whenever the user's userId, any filter, or the
  // page changes, 500ms after the last change. This also covers the very
  // first load — no separate "on mount" fetch needed.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProviderHolidays();
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [fetchProviderHolidays]);

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ label: category.categoryName, value: category.categoryId })),
    [categories]
  );

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditingItem(item);
    setModalOpen(true);
  };

  // Throws on failure so <MenuItemFormModal /> knows the save failed and
  // keeps the popup open instead of closing (see its own try/catch).
  const handleSave = async (formData) => {
    try {
      if (modalMode === "edit") {
        const response = await updateProviderHoliday(formData.id, formData);

        toast.success(response?.message ?? "Holiday updated successfully..!");
      } else {
        const response = await addProviderHoliday(formData);
        toast.success(response?.message ?? "Holiday added successfully..!");
      }
      await fetchProviderHolidays();
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message ? err.response.data.message : "Couldn't save this Holiday. Please try again.");
      throw err;
    }
  };

  const toggleStatus = async (holidayId, isActive) => {
    setProcessingId(holidayId);
    try {
      const response = await toggleProviderHolidayStatus(holidayId, !isActive);
      toast.success(response?.message ?? (isActive ? "Holiday disabled." : "Holiday enabled."));
      await fetchProviderHolidays();
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
      const response = await deleteProviderHoliday(target.id);
      toast.success(response?.message ?? "Holiday deleted successfully..!");
      await fetchProviderHolidays();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete this holiday. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- Column config for the generic <DataTable /> ---
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (holiday) => <div className="hb-table__name">{holiday.name}</div>
    },
    {
      key: "closedDate",
      header: "Date",
      render: (holiday) => {
        const date = holiday.closedDate ? new Date(holiday.closedDate) : null;
        return date ? (
          <>
            <div>{date.toLocaleDateString()}</div>
            {/* <div className="hb-table__desc">{date.toLocaleTimeString()}</div> */}
          </>
        ) : (
          "—"
        );
      }
    },
    { key: "description", header: "Description", render: (holiday) => holiday.description },
    {
      key: "status",
      header: "Status",
      render: (holiday) => (
        <StatusBadge
          label={holiday.isActive ? "Active" : "Inactive"}
          variant={holiday.isActive ? "success" : "danger"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      // Icon-only buttons — three actions per row is tight on space, so
      // each shows its label as a hover tooltip instead of inline text.
      render: (holiday) => (
        <div className="hb-table__actions">
          <TableActionButton
            variant="update"
            icon={FaEdit}
            iconOnly
            label="Update"
            onClick={() => openEditModal(holiday)}
            disabled={processingId === holiday.id}
          />
          {holiday.isActive ? (
            <TableActionButton
              variant="disable"
              icon={MdBlock}
              iconOnly
              label="Disable"
              onClick={() => toggleStatus(holiday.id, holiday.isActive)}
              disabled={processingId === holiday.id}
            />
          ) : (
            <TableActionButton
              variant="enable"
              icon={MdCheckCircle}
              iconOnly
              label="Enable"
              onClick={() => toggleStatus(holiday.id, holiday.isActive)}
              disabled={processingId === holiday.id}
            />
          )}
          <TableActionButton
            variant="delete"
            icon={FaTrash}
            iconOnly
            label="Delete"
            onClick={() => setDeleteTarget(holiday)}
            disabled={processingId === holiday.id}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="hb-menuitems hb-list-page">
      <PageHeader
        title="Holidays"
        action={
          <button type="button" className="btn hb-btn-primary" onClick={openAddModal}>
            <FaPlus className="me-2" /> Add new holiday
          </button>
        }
      />
      {error && <ErrorState message={error} onRetry={fetchProviderHolidays} />}

      {/* <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: "Search menu items..." }}
        filters={[
          // {
          //   key: "type",
          //   value: typeFilter,
          //   onChange: setTypeFilter,
          //   allLabel: "All Types",
          //   options: MENU_TYPE_OPTIONS.map((type) => ({
          //     label: type.charAt(0) + type.slice(1).toLowerCase(),
          //     value: type,
          //   })),
          // },
          // {
          //   key: "category",
          //   value: categoryFilter,
          //   onChange: setCategoryFilter,
          //   allLabel: "All Categories",
          //   options: categoryOptions,
          // },
          // {
          //   key: "status",
          //   value: statusFilter,
          //   onChange: setStatusFilter,
          //   allLabel: "All Status",
          //   options: [
          //     { label: "Active", value: "ACTIVE" },
          //     { label: "Inactive", value: "INACTIVE" },
          //   ],
          // },
        ]}
        onReset={handleResetFilters}
      /> */}

      <DataTable
        columns={columns}
        data={providerHolidays}
        rowKey={(holiday) => holiday.id}
        emptyMessage="No holidays match your search/filters."
        isLoading={loading}
        loadingMessage="Loading provider holidays..."
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <ProviderHolidayModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={editingItem}
        categories={categories}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete menu item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This can't be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

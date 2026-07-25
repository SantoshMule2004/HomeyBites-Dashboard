// src/pages/MenuItems/MenuItemsPage.jsx
//
// Table-based Menu Items page, built from the reusable pieces in
// src/Components/tables/ (FiltersBar, DataTable, StatusBadge,
// TableActionButton, Pagination) and src/Components/common/ (ConfirmDialog,
// LoadingSpinner, ErrorState) — the same Components you can reuse on
// Tiffin Plans, Orders, Subscriptions, etc.

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { MdBlock, MdCheckCircle } from "react-icons/md";
import { toast } from "react-toastify";
import FiltersBar from "../../../Components/tables/FiltersBar";
import DataTable from "../../../Components/tables/DataTable";
import StatusBadge from "../../../Components/tables/StatusBadge";
import TableActionButton from "../../../Components/tables/TableActionButton";
import ConfirmDialog from "../../../Components/common/ConfirmDialog";
import ErrorState from "../../../Components/common/ErrorState";
import "./providers.css";
import ProviderMenuModal from './ProviderMenuModal';
import { useUserInfo } from "../../../Context/UserContext";
import PageHeader from "../../../Components/common/PageHeader";
import { deleteProviderMenu, getAllMenus, toggleProviderMenuStatus, updateProviderMenuitems } from "../../../Services/providerMenuService";

const PAGE_SIZE = 5
const SEARCH_DEBOUNCE_MS = 500;

export default function ProviderMenusPage() {
  const [providerMenus, setProviderMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // menuId currently being updated/enabled/disabled/deleted — disables just
  // that row's action buttons instead of freezing the whole table.
  const [processingId, setProcessingId] = useState(null);

  // Server-driven pagination — `page` is 0-based, matching PageResponse.page
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingItem, setEditingItem] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // --- Fetch menu items from the server, respecting current filters + page ---
  const fetchProviderMenus = useCallback(() => {
    setLoading(true);
    setError(null);

    // 👇 Extend getMenuItemsOfProvider in MenuService.js to accept page/size
    // and pass them through as query params (Spring's Pageable reads them
    // as ?page=0&size=4 by default).
    return getAllMenus()
      // user.userId,
      // menuType,
      // searchText,
      // categoryId,
      // isActive,
      // page,
      // PAGE_SIZE
      // )
      .then((response) => {
        setProviderMenus(response);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your Menus. Please check your connection and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Debounced: re-fetches whenever the user's userId, any filter, or the
  // page changes, 500ms after the last change. This also covers the very
  // first load — no separate "on mount" fetch needed.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProviderMenus();
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [fetchProviderMenus]);


  // const handleResetFilters = () => {
  //   setSearch("");
  //   setTypeFilter("ALL");
  //   setCategoryFilter("ALL");
  //   setStatusFilter("ALL");
  // };

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
    // console.log(JSON.stringify(formData, null, 2));
    try {
      if (modalMode === "edit") {
        const response = await updateProviderMenuitems(formData.id, formData.meals);

        toast.success(response?.message ?? "Meals added successfully..!");
      } else {
        const response = await addProviderHoliday(formData);
        toast.success(response?.message ?? "Holiday added successfully..!");
      }
      await fetchProviderMenus();
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message ? err.response.data.message : "Couldn't save this Meal. Please try again.");
      throw err;
    }
  };

  const toggleStatus = async (menuId, isActive) => {
    setProcessingId(menuId);
    try {
      const response = await toggleProviderMenuStatus(menuId, !isActive);
      toast.success(response?.message ?? (isActive ? "Menu disabled." : "Menu enabled."));
      await fetchProviderMenus();
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
      const response = await deleteProviderMenu(target.id);
      toast.success(response?.message ?? "Menu deleted successfully..!");
      await fetchProviderMenus();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete this Menu. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- Column config for the generic <DataTable /> ---
  const columns = [
    {
      key: "dayOfWeek",
      header: "Day",
      render: (menu) => <div className="hb-table__name">{menu.dayOfWeek}</div>
    },
    {
      key: "meals",
      header: "Meals",
      render: (menu) => {
        if (!menu.meals || menu.meals.length === 0) {
          return <span className="text-muted">No meals added</span>;
        }

        return (
          <div className="hb-table__meals">
            {menu.meals.map((meal) => (
              <div key={meal.mealType} className="hb-table__meal">
                <strong>{meal.mealType.at(0).toUpperCase() + meal.mealType.slice(1).toLowerCase()}:</strong> {meal.foodItems ? meal.foodItems : '-'}
              </div>
            ))}
          </div>
        );
      },
    },
    // { key: "description", header: "Description", render: (holiday) => holiday.description },
    {
      key: "status",
      header: "Status",
      render: (menu) => (
        <StatusBadge
          label={menu.isActive ? "Active" : "Inactive"}
          variant={menu.isActive ? "success" : "danger"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      // Icon-only buttons — three actions per row is tight on space, so
      // each shows its label as a hover tooltip instead of inline text.
      render: (menu) => (
        <div className="hb-table__actions">
          <TableActionButton
            variant="update"
            icon={FaEdit}
            iconOnly
            label="Add meals"
            onClick={() => openEditModal(menu)}
            disabled={processingId === menu.id}
          />
          {menu.isActive ? (
            <TableActionButton
              variant="disable"
              icon={MdBlock}
              iconOnly
              label="Disable"
              onClick={() => toggleStatus(menu.id, menu.isActive)}
              disabled={processingId === menu.id}
            />
          ) : (
            <TableActionButton
              variant="enable"
              icon={MdCheckCircle}
              iconOnly
              label="Enable"
              onClick={() => toggleStatus(menu.id, menu.isActive)}
              disabled={processingId === menu.id}
            />
          )}
          {/* <TableActionButton
            variant="delete"
            icon={FaTrash}
            iconOnly
            label="Delete"
            onClick={() => setDeleteTarget(menu)}
            disabled={processingId === menu.id}
          /> */}
        </div>
      ),
    },
  ];

  return (
    <div className="hb-menuitems hb-list-page">
      <PageHeader
        title="Menus"
      />
      {error && <ErrorState message={error} onRetry={fetchProviderMenus} />}

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
        data={providerMenus}
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

      <ProviderMenuModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={editingItem}
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

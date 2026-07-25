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
import PageHeader from "../../../Components/common/PageHeader";
import { MENU_TYPE_OPTIONS } from "../../../utils/config";
import MenuItemFormModal from "./MenuItemFormModal";
import "./MenuItems.css";
import { useUserInfo } from "../../../Context/UserContext";
import {
  addMenuItemWithImage,
  deleteMenuItem,
  getMenuItemsOfProvider,
  toggleMenuItem,
  updateMenuItem,
  uploadMenuItemImage,
} from "../../../Services/menuService";
import { useMenuItems } from "../../../Context/MenuItemContext";
import { formatPrice } from "../../../utils/formatPrice";

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 500;

export default function MenuItemsPage({ providerId: providerIdProp, readOnly = false, pageTitle }) {
  const [menuItems, setMenuItems] = useState([]);
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

  const effectiveProviderId = providerIdProp ?? user?.userId;

  // --- Fetch menu items from the server, respecting current filters + page ---
  const fetchMenuItems = useCallback(() => {
    if (!user?.userId) return Promise.resolve();

    const menuType = typeFilter === "ALL" ? null : typeFilter;
    const isActive = statusFilter === "ALL" ? null : statusFilter === "ACTIVE";
    const categoryId = categoryFilter === "ALL" ? null : categoryFilter;
    const searchText = search.trim() === "" ? null : search.trim();

    setLoading(true);
    setError(null);

    // 👇 Extend getMenuItemsOfProvider in MenuService.js to accept page/size
    // and pass them through as query params (Spring's Pageable reads them
    // as ?page=0&size=4 by default).
    return getMenuItemsOfProvider(
      effectiveProviderId,
      menuType,
      searchText,
      categoryId,
      isActive,
      page,
      PAGE_SIZE
    )
      .then((response) => {
        setMenuItems(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your menu items. Please check your connection and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [effectiveProviderId, typeFilter, statusFilter, categoryFilter, search, page]);

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
      fetchMenuItems();
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [fetchMenuItems]);

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
    const { imageFile, categoryId, ...menuItemFields } = formData;

    try {
      if (modalMode === "edit") {
        const response = await updateMenuItem(formData.menuId, {
          ...menuItemFields,
          categoryId,
        });

        // Backend: POST /menuitem/upload/{menuId}, a *separate* endpoint
        // from the field update above — only call it if a new image was
        // actually picked in the form.
        if (imageFile) {
          const imagePayload = new FormData();
          imagePayload.append("file", imageFile);
          await uploadMenuItemImage(formData.menuId, imagePayload);
        }

        toast.success(response?.message ?? "Menu item updated successfully..!");
      } else {
        // Backend: POST /menuitem-image/tiffin-provider/{providerId}/category/{cId}
        // consumes multipart/form-data with two parts:
        //   - "menuItemData": the MenuItem fields, as a JSON blob
        //   - "file": the image, as MultipartFile
        // Spring's @RequestPart matches parts by these exact names, so they
        // must be "menuItemData" and "file".
        const payload = new FormData();
        payload.append(
          "menuItemData",
          new Blob([JSON.stringify(menuItemFields)], { type: "application/json" })
        );
        payload.append("file", imageFile);

        const response = await addMenuItemWithImage(user.userId, categoryId, payload);
        toast.success(response?.message ?? "Menu item added successfully..!");
      }
      await fetchMenuItems();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save this menu item. Please try again.");
      throw err;
    }
  };

  const toggleStatus = async (menuId, isActive) => {
    setProcessingId(menuId);
    try {
      const response = await toggleMenuItem(menuId, !isActive);
      toast.success(response?.message ?? (isActive ? "Menu item disabled." : "Menu item enabled."));
      await fetchMenuItems();
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
    setProcessingId(target.menuId);
    try {
      const response = await deleteMenuItem(target.menuId);
      toast.success(response?.message ?? "Menu item deleted successfully..!");
      await fetchMenuItems();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete this item. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- Column config for the generic <DataTable /> ---
  const baseColumns = [
    {
      key: "image",
      header: "Image",
      render: (item) =>
        item.imageUrl ? (
          <img src={item.imageUrl} alt={item.menuName} className="hb-table__thumb" />
        ) : (
          <FaImage className="hb-table__thumb-placeholder" />
        ),
    },
    {
      key: "name",
      header: "Name",
      render: (item) => (
        <>
          <div className="hb-table__name">{item.menuName}</div>
          <div className="hb-table__desc">{item.description}</div>
        </>
      ),
    },
    { key: "menuType", header: "Menu Type", render: (item) => item.menuType },
    { key: "category", header: "Category", render: (item) => item.categoryName },
    { key: "price", header: "Price", render: (item) => `${ formatPrice(item.price)}` },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge
          label={item.isActive ? "Active" : "Inactive"}
          variant={item.isActive ? "success" : "danger"}
        />
      ),
    },
  ];

  const actionsColumn = {
    key: "actions",
    header: "Actions",
    // Icon-only buttons — three actions per row is tight on space, so
    // each shows its label as a hover tooltip instead of inline text.
    render: (item) => (
      <div className="hb-table__actions">
        <TableActionButton
          variant="update"
          icon={FaEdit}
          iconOnly
          label="Update"
          onClick={() => openEditModal(item)}
          disabled={processingId === item.menuId}
        />
        {item.isActive ? (
          <TableActionButton
            variant="disable"
            icon={MdBlock}
            iconOnly
            label="Disable"
            onClick={() => toggleStatus(item.menuId, item.isActive)}
            disabled={processingId === item.menuId}
          />
        ) : (
          <TableActionButton
            variant="enable"
            icon={MdCheckCircle}
            iconOnly
            label="Enable"
            onClick={() => toggleStatus(item.menuId, item.isActive)}
            disabled={processingId === item.menuId}
          />
        )}
        <TableActionButton
          variant="delete"
          icon={FaTrash}
          iconOnly
          label="Delete"
          onClick={() => setDeleteTarget(item)}
          disabled={processingId === item.menuId}
        />
      </div>
    ),
  };

  const columns = readOnly ? baseColumns : [...baseColumns, actionsColumn];

  return (
    <div className="hb-menuitems hb-list-page">
      <PageHeader
        title={pageTitle || "Menu Items"}
        action={
          !readOnly && (
            <button type="button" className="btn hb-btn-primary" onClick={openAddModal}>
              <FaPlus className="me-2" /> Add New Item
            </button>
          )
        }
      />

      {error && <ErrorState message={error} onRetry={fetchMenuItems} />}

      <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: "Search menu items..." }}
        filters={[
          {
            key: "type",
            value: typeFilter,
            onChange: setTypeFilter,
            allLabel: "All Types",
            options: MENU_TYPE_OPTIONS.map((type) => ({
              label: type.charAt(0) + type.slice(1).toLowerCase(),
              value: type,
            })),
          },
          {
            key: "category",
            value: categoryFilter,
            onChange: setCategoryFilter,
            allLabel: "All Categories",
            options: categoryOptions,
          },
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
      />

      <DataTable
        columns={columns}
        data={menuItems}
        rowKey={(item) => item.menuId}
        emptyMessage="No menu items match your search/filters."
        isLoading={loading}
        loadingMessage="Loading menu items..."
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {!readOnly && (
        <>
          <MenuItemFormModal
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
            message={`Are you sure you want to delete "${deleteTarget?.menuName}"? This can't be undone.`}
            confirmLabel="Delete"
            variant="danger"
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      )}
    </div>
  );
}

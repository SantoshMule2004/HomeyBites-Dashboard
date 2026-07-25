// src/pages/Admin/Providers/AdminProvidersPage.jsx
//
// Lists every tiffin provider. Admin has no create/edit/delete here — the
// only per-row action is the kebab (⋮) menu with four "View X" options.
// Each option navigates to its own dedicated route for that provider
// (rather than opening a modal), so Menu Items / Tiffin Plans reuse the
// exact same pages the provider sees — full search, filters, and
// pagination included — just in read-only mode. See:
//   AdminProviderMenuItemsPage.jsx    -> /admin/providers/:providerId/menu-items
//   AdminProviderTiffinPlansPage.jsx  -> /admin/providers/:providerId/tiffin-plans
//   AdminProviderDetailsPage.jsx      -> /admin/providers/:providerId
//   AdminProviderHolidaysPage.jsx     -> /admin/providers/:providerId/holidays
//
// List columns use the confirmed RecentProviderProjection fields
// (providerId, businessName, ownerName, emailId, active, createdAt).

import { useNavigate } from "react-router-dom";
import { FaUtensils, FaClipboardList, FaUserCircle, FaUmbrellaBeach } from "react-icons/fa";
import AdminListPage from "../../AdminListPage";
import KebabMenu from "../../../../Components/tables/KebabMenu";
import StatusBadge from "../../../../Components/tables/StatusBadge";
import { getAllUsers } from "../../../../Services/userService";
import ProviderDetailsModal from "./ProviderDetailsModal";
import { useState } from "react";

export default function AdminProvidersPage() {
  const navigate = useNavigate();
  const [viewTarget, setViewTarget] = useState(null);

  const goTo = (path, provider) => {
    navigate(path, { state: { businessName: provider.businessName } });
  };

  const columns = [
    { key: "businessName", header: "Business Name", render: (p) => p.businessName },
    { key: "ownerName", header: "Owner", render: (p) => (p.firstName + " " + p.lastName) },
    { key: "email", header: "Email", render: (p) => p.emailId },
    {
      key: "createdAt",
      header: "Joined",
      render: (p) => (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <StatusBadge label={p.active ? "Active" : "Inactive"} variant={p.active ? "success" : "danger"} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <KebabMenu
          options={[
            {
              label: "View Provider",
              icon: FaUserCircle,
              onClick: () => setViewTarget(p),
            },
            {
              label: "View Menu Items",
              icon: FaUtensils,
              onClick: () => goTo(`/admin/providers/${p.userId}/menu-items`, p),
            },
            {
              label: "View Tiffin Plans",
              icon: FaClipboardList,
              onClick: () => goTo(`/admin/providers/${p.userId}/tiffin-plans`, p),
            },
            {
              label: "Provider Holidays",
              icon: FaUmbrellaBeach,
              onClick: () => goTo(`/admin/providers/${p.userId}/holidays`, p),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <AdminListPage
        title="Tiffin Providers"
        columns={columns}
        rowKey={(p) => p.userId}
        searchPlaceholder="Search by business or owner name..."
        useDateFilter={false}
        emptyMessage="No providers match your search/filters."
        fetchFn={(params) => getAllUsers(params)}
        userRole="ROLE_TIFFIN_PROVIDER"
      />

      <ProviderDetailsModal
        isOpen={!!viewTarget}
        providerId={viewTarget?.userId}
        onClose={() => setViewTarget(null)}
      />
    </>
  );
}

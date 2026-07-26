// src/pages/Admin/Providers/AdminProviderHolidaysPage.jsx
//
// Route: /admin/providers/:providerId/holidays
//
// No provider-facing "Holidays" page exists yet to reuse, so this is built
// directly on the same <AdminListPage /> shell as Orders/Payments/
// Subscriptions/Providers — full search + date-range filter + pagination,
// read-only (no actions, matching every other admin list page).

import { useParams, useLocation } from "react-router-dom";
import AdminListPage from "../../AdminListPage";
import { getAllHolidaysForAdmin } from "../../../../Services/providerHolidayService";
import StatusBadge from "../../../../Components/tables/StatusBadge";

export default function AdminProviderHolidaysPage() {
  const { providerId } = useParams();
  const location = useLocation();
  const businessName = location.state?.businessName;

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (holiday) => (holiday.closedDate ? new Date(holiday.closedDate).toLocaleDateString() : "—"),
    },
    { key: "name", header: "Name", render: (holiday) => holiday.name },
    { key: "description", header: "Description", render: (holiday) => holiday.description || "—" },
    {
      key: "status",
      header: "Status",
      render: (holiday) => (
        <StatusBadge label={holiday.isActive ? "Active" : "Inactive"} variant={holiday.isActive ? "success" : "danger"} />
      ),
    },
  ];

  return (
    <AdminListPage
      title={businessName ? `Holidays — ${businessName}` : "Provider Holidays"}
      columns={columns}
      rowKey={(holiday) => holiday.id}
      searchPlaceholder="Search by reason..."
      emptyMessage="No holidays found for this provider."
      fetchFn={(params) => getAllHolidaysForAdmin(providerId, params)}
      useDateFilter={false}
    />
  );
}

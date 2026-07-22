// src/pages/Admin/Subscriptions/AdminSubscriptionsPage.jsx
//
// Admin's view of all subscriptions across every provider — read-only.
// Columns match the real RecentSubscriptionProjection fields (subscriptionId,
// customerName, planName, startDate, currentEndDate, status).
//
// 👇 `status` is a free string on the backend (no enum given), so the
// filter options below are a reasonable guess (ACTIVE / EXPIRED /
// CANCELLED) — adjust to your real values. Colors are derived generically
// via guessStatusVariant() rather than a fixed lookup table.

import { getAdminSubscriptions } from "../../../Services/subscriptionService";
import StatusBadge from "../../../components/tables/StatusBadge";
import AdminListPage from "../AdminListPage";
import { guessStatusVariant } from "../../../utils/statusVariant";
import { SUB_STATUS_OPTIONS } from "../../../utils/config";

const columns = [
  {
    key: "customer", header: "Customer", render: (sub) => (
      <>
        <div className="hb-table__name">{sub.customerName}</div>
        <div className="hb-table__desc">{sub.phoneNo} - {sub.emailId}</div>
      </>)
  },
  { key: "provider", header: "Provider", render: (sub) => sub.providerName },
  { key: "plan", header: "Plan", render: (sub) => sub.planName },
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
    key: "startDate",
    header: "Start Date",
    render: (sub) => (sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "—"),
  },
  {
    key: "endDate",
    header: "Ends",
    render: (sub) => (sub.currentEndDate ? new Date(sub.currentEndDate).toLocaleDateString() : "—"),
  },
  {
    key: "status",
    header: "Status",
    render: (sub) => <StatusBadge label={sub.status} variant={guessStatusVariant(sub.status)} />,
  },
];

export default function AdminSubscriptionsPage() {
  return (
    <AdminListPage
      title="Subscriptions"
      columns={columns}
      rowKey={(sub) => sub.subscriptionId}
      searchPlaceholder="Search by customer or provider name..."
      emptyMessage="No subscriptions match your search/filters."
      filterDefs={[
        {
          key: "status",
          allLabel: "All Status",
          options: SUB_STATUS_OPTIONS.map((status) => ({
            label: status.charAt(0) + status.slice(1).toLowerCase(),
            value: status,
          })),
        },
      ]}
      fetchFn={getAdminSubscriptions}
      useDateFilter={false}
    />
  );
}

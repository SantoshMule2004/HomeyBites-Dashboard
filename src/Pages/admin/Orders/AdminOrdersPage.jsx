// src/pages/Admin/Orders/AdminOrdersPage.jsx
//
// Admin's view of ALL orders across every provider — read-only, no
// status-update or delete actions (unlike the provider's own OrdersPage).
// Built on the same AdminListPage shell used by Payments/Subscriptions.
//
// Columns are based on the real RecentOrderProjection fields (providerOrderId,
// customerOrderId, customerName, amount, fulfillmentStatus, createdAt) —
// 👇 PLUS an assumed `providerName` field, since admin needs to know which
// provider each order belongs to (not something the provider's own list
// needs). Confirm your admin orders endpoint actually returns this.
//
// 👇 paymentStatus is also assumed present on the full admin list response
// even though it isn't part of RecentOrderProjection (that projection was
// designed for the dashboard's "recent 5" widget, which may be a subset of
// fields) — remove the Payment Status column/filter if your endpoint
// doesn't return it.

import { getOrders } from "../../../Services/orderService";
import StatusBadge from "../../../components/tables/StatusBadge";
import AdminListPage from "../AdminListPage";
import { ORDER_STATUS_OPTIONS, ORDER_STATUS_META, PAYMENT_STATUS_OPTIONS, PAYMENT_STATUS_META, getStatusMeta } from "../../../utils/config";

const columns = [
  {
    key: "id",
    header: "Order",
    render: (order) => <span className="hb-table__name">#{order.providerOrderId}</span>,
  },
  { key: "customer", header: "Customer", render: (order) => order.receiverName },
  { key: "provider", header: "Provider", render: (order) => order.businessName },
  { key: "amount", header: "Amount", render: (order) => `₹ ${order.vendorSubtotal}` },
  {
    key: "orderStatus",
    header: "Order Status",
    render: (order) => {
      const meta = getStatusMeta(ORDER_STATUS_META, order.fulfillmentStatus);
      return <StatusBadge label={meta.label} variant={meta.variant} />;
    },
  },
  {
    key: "paymentStatus",
    header: "Payment Status",
    render: (order) => {
      const meta = getStatusMeta(PAYMENT_STATUS_META, order.paymentStatus);
      return <StatusBadge label={meta.label} variant={meta.variant} />;
    },
  },
  {
    key: "createdAt",
    header: "Placed At",
    render: (order) => (order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"),
  },
];

export default function AdminOrdersPage() {
  return (
    <AdminListPage
      title="Orders"
      columns={columns}
      rowKey={(order) => order.providerOrderId}
      searchPlaceholder="Search by customer or provider name..."
      emptyMessage="No orders match your search/filters."
      filterDefs={[
        {
          key: "status",
          allLabel: "All Order Status",
          options: ORDER_STATUS_OPTIONS.map((status) => ({
            label: getStatusMeta(ORDER_STATUS_META, status).label,
            value: status,
          })),
        },
        // {
        //   key: "paymentStatus",
        //   allLabel: "All Payment Status",
        //   options: PAYMENT_STATUS_OPTIONS.map((status) => ({
        //     label: getStatusMeta(PAYMENT_STATUS_META, status).label,
        //     value: status,
        //   })),
        // },
      ]}
      fetchFn={getOrders}
    />
  );
}

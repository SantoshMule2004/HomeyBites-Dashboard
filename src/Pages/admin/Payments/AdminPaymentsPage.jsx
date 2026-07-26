// src/pages/Admin/Payments/AdminPaymentsPage.jsx
//
// Admin's view of all payments across every provider — read-only.
// Columns match the real RecentPaymentProjection fields exactly (paymentId,
// customerName, providerName, amount, paymentMethod, paymentStatus, paidAt)
// — no assumptions needed here since that projection was already confirmed.

import { getAdminPayments } from "../../../Services/paymentService";
import StatusBadge from "../../../Components/tables/StatusBadge";
import AdminListPage from "../AdminListPage";
import { PAYMENT_STATUS_OPTIONS, PAYMENT_STATUS_META, getStatusMeta, PAYMENT_METHOD_OPTIONS, PAYMENT_METHOD_META } from "../../../utils/config";
import { formatPrice } from "../../../utils/formatPrice";

const columns = [
  { key: "customer", header: "Customer", render: (payment) => payment.customerName },
  { key: "provider", header: "Provider", render: (payment) => payment.providerName },
  { key: "amount", header: "Amount", render: (payment) => `${formatPrice(payment.amount)}` },
  { key: "type", header: "Type", render: (payment) => `${payment.paymentType}` },
  { key: "method", header: "Method", render: (payment) => payment.paymentMethod ? payment.paymentMethod : "—" },
  {
    key: "status",
    header: "Status",
    render: (payment) => {
      const meta = getStatusMeta(PAYMENT_STATUS_META, payment.paymentStatus);
      return <StatusBadge label={meta.label} variant={meta.variant} />;
    },
  },
  {
    key: "paidAt",
    header: "Paid At",
    render: (payment) => (payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "—"),
  },
];

export default function AdminPaymentsPage() {
  return (
    <AdminListPage
      title="Payments"
      columns={columns}
      rowKey={(payment) => payment.paymentId}
      searchPlaceholder="Search by customer or provider name..."
      emptyMessage="No payments match your search/filters."
      filterDefs={[
        {
          key: "paymentStatus",
          allLabel: "All Status",
          options: PAYMENT_STATUS_OPTIONS.map((status) => ({
            label: getStatusMeta(PAYMENT_STATUS_META, status).label,
            value: status,
          })),
        },
        {
          key: "paymentMethod",
          allLabel: "All Methods",
          options: PAYMENT_METHOD_OPTIONS.map((status) => ({
            label: getStatusMeta(PAYMENT_METHOD_META, status).label,
            value: status,
          })),
        },
      ]}
      fetchFn={getAdminPayments}
    />
  );
}

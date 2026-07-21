// src/components/tables/StatusBadge.jsx
//
// Generic status pill for table cells — Active/Inactive, Pending/Completed,
// Approved/Rejected, etc. Pick the closest variant and it handles the color.

import "./Table.css";

const VARIANT_CLASS = {
  success: "hb-badge--success", // e.g. Active, Completed, Approved, Delivered
  danger: "hb-badge--danger", // e.g. Inactive, Rejected, Cancelled, Failed
  warning: "hb-badge--warning", // e.g. Pending, Expiring soon
  info: "hb-badge--info", // e.g. Preparing, In Progress
  accent: "hb-badge--accent", // e.g. Out for Delivery
  neutral: "hb-badge--neutral", // e.g. Draft, N/A
};

export default function StatusBadge({ label, variant = "neutral" }) {
  return (
    <span className={`hb-badge ${VARIANT_CLASS[variant] || VARIANT_CLASS.neutral}`}>
      {label}
    </span>
  );
}

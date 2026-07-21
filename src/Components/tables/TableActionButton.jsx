// src/components/tables/TableActionButton.jsx
//
// Icon-only action button for table rows — Update, Enable, Disable,
// Delete, View, etc. Shows just the icon (so several fit side by side in a
// tight Actions column) and reveals its `label` as a tooltip on hover/focus.
//
// Usage:
//   <TableActionButton variant="delete" icon={FaTrash} label="Delete" onClick={...} />

import "./Table.css";

const VARIANT_CLASS = {
  update: "hb-icon-btn--update",
  enable: "hb-icon-btn--enable",
  disable: "hb-icon-btn--disable",
  delete: "hb-icon-btn--delete",
  neutral: "hb-icon-btn--neutral",
};

export default function TableActionButton({
  variant = "neutral",
  icon: Icon,
  label,
  iconOnly, // accepted for readability at call sites; buttons are always icon-only here
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`hb-icon-btn ${VARIANT_CLASS[variant] || VARIANT_CLASS.neutral}`}
      data-tooltip={label}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      {Icon && <Icon />}
    </button>
  );
}

// menuitems related 
export const MENU_TYPE_OPTIONS = ["BREAKFAST", "LUNCH", "DINNER"];


// order related
export const ORDER_STATUS_OPTIONS = ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

export const ORDER_STATUS_META = {
  PENDING: { label: "Pending", variant: "warning" },
  PREPARING: { label: "Preparing", variant: "info" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", variant: "accent" },
  DELIVERED: { label: "Delivered", variant: "success" },
};

// Payment related
export const PAYMENT_STATUS_OPTIONS = ["PAID", "PENDING", "PARTIALLY_REFUNDED", "REFUNDED", "FAILED",];

export const PAYMENT_STATUS_META = {
  PAID: { label: "Paid", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  REFUNDED: { label: "Refunded", variant: "accent" },
  PARTIALLY_REFUNDED: { label: "Partially Refunded", variant: "info" },
  FAILED: { label: "Failed", variant: "danger" },
};

export const PAYMENT_METHOD_OPTIONS = ["UPI", "COD"];
// "CARD", "NET_BANKING", "WALLET",

export const PAYMENT_METHOD_META = {
  UPI: { label: "UPI", variant: "warning" },
  // CARD: { label: "Card", variant: "success" },
  // NET_BANKING: { label: "Net Banking", variant: "danger" },
  // WALLET: { label: "Wallet", variant: "danger" },
  COD: { label: "COD", variant: "danger" },
};

export const UPDATE_PAYMENT_STATUS_OPTIONS = ["PAID", "PENDING", "FAILED",];

export const UPDATE_PAYMENT_STATUS_META = {
  PAID: { label: "Paid", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  FAILED: { label: "Failed", variant: "danger" },
};

// Delivery related
export const DELIVERY_STATUS_OPTIONS = ["PENDING", "DELIVERED", "FAILED"];

export const DELIVERY_STATUS_META = {
  PENDING: { label: "Pending", variant: "warning" },
  DELIVERED: { label: "Delivered", variant: "success" },
  FAILED: { label: "Failed", variant: "danger" },
};


// Subscription related
export const SUB_STATUS_OPTIONS = ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED", "HISTORY"];

export const SUB_STATUS_META = {
  ACTIVE: { label: "Active", variant: "success" },
  PAUSED: { label: "Paused", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "neutral" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
  HISTORY: { label: "History", variant: "info" },
};

export const getStatusMeta = (metaMap, status) =>
  metaMap[status] || { label: status || "Unknown", variant: "neutral" };

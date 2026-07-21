// src/utils/statusVariant.js
//
// For status strings that don't have a dedicated meta map (like
// RecentSubscriptionProjection.status) — makes a reasonable guess at a
// <StatusBadge variant based on common wording, so you get sensible colors
// without hardcoding every backend enum value.

export const guessStatusVariant = (status) => {
  const s = (status || "").toUpperCase();

  if (["ACTIVE", "SUCCESS", "SUCCESSFUL", "COMPLETED", "DELIVERED", "PAID", "APPROVED"].includes(s)) {
    return "success";
  }
  if (["EXPIRED", "CANCELLED", "CANCELED", "FAILED", "REJECTED", "INACTIVE"].includes(s)) {
    return "danger";
  }
  if (["PENDING", "PROCESSING", "PREPARING"].includes(s)) {
    return "warning";
  }
  return "neutral";
};
// src/pages/Admin/Providers/AdminProviderTiffinPlansPage.jsx
//
// Route: /admin/providers/:providerId/tiffin-plans
//
// Reuses the exact same TiffinPlansPage the provider sees (search, status
// filter, pagination all included for free) — just scoped to this
// providerId and with readOnly so no Add/Update/Enable/Disable/Delete
// controls render.

import { useParams, useLocation } from "react-router-dom";
import TiffinPlansPage from "../../../../Pages/provider/TiffinPlan/TiffinPlansPage";

export default function AdminProviderTiffinPlansPage() {
  const { providerId } = useParams();
  const location = useLocation();
  const businessName = location.state?.businessName;

  return (
    <TiffinPlansPage
      providerId={Number(providerId)}
      readOnly
      pageTitle={businessName ? `Tiffin Plans — ${businessName}` : "Tiffin Plans"}
    />
  );
}

// src/pages/Admin/Providers/AdminProviderMenuItemsPage.jsx
//
// Route: /admin/providers/:providerId/menu-items
//
// Reuses the exact same MenuItemsPage the provider sees (search, filters,
// pagination all included for free) — just scoped to this providerId and
// with readOnly so no Add/Update/Enable/Disable/Delete controls render.

import { useParams, useLocation } from "react-router-dom";
import MenuItemsPage from "../../../provider/MenuItem/MenuItemsPage";

export default function AdminProviderMenuItemsPage() {
  const { providerId } = useParams();
  const location = useLocation();
  const businessName = location.state?.businessName;

  return (
    <MenuItemsPage
      providerId={Number(providerId)}
      readOnly
      pageTitle={businessName ? `Menu Items — ${businessName}` : "Menu Items"}
    />
  );
}

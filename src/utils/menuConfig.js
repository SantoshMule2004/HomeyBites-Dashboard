import { FaRegCalendarAlt } from "react-icons/fa";
import { MdAttachMoney, MdCategory, MdDashboard, MdLocalShipping, MdMenuBook, MdOutlineBreakfastDining, MdOutlineCountertops, MdOutlinePrecisionManufacturing, MdOutlineRestaurantMenu, MdOutlineSettings, MdPeople, MdRateReview, MdRestaurantMenu, MdSettings, MdShoppingCart, MdStorefront, MdSubscriptions } from "react-icons/md";

const providerMenu = [
  {
    label: "Dashboard",
    path: "/provider/dashboard",
    icon: MdDashboard,
  },
  {
    label: "Menu",
    icon: MdStorefront,
    children: [
      { label: "Menu Items", path: "/provider/menu-items" },
    ],
  },
  {
    label: "Plans",
    icon: MdRestaurantMenu,
    children: [
      { label: "Tiffin Plans", path: "/provider/tiffin-plans" },
      { label: "Weekly Menu", path: "/provider/menus" },
    ],
  },
  {
    label: "Subscriptions",
    icon: MdSubscriptions,
    children: [
      { label: "Customer Subscriptions", path: "/provider/subscriptions" },
      { label: "Daily Deliveries", path: "/provider/daily-deliveries" },
    ],
  },
  {
    label: "Orders",
    path: "/provider/orders",
    icon: MdShoppingCart,
  },

  {
    label: "Operations",
    icon: MdOutlineCountertops,
    children: [
      { label: "Provider Holidays", path: "/provider/holidays" },
    ],
  },
  {
    label: "Finance",
    icon: MdAttachMoney,
    children: [
      // { label: "Revenue", path: "/revenue" },
      { label: "Payments", path: "/provider/payments" },
    ],
  },
  {
    label: "Settings",
    path: "/settings",
    icon: MdSettings,
  },
];

const adminMenu = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: MdDashboard,
  },
  {
    label: "Users",
    icon: MdPeople,
    children: [
      { label: "Tiffin Providers", path: "/admin/providers" },
      { label: "Customers", path: "/admin/providers/pending" },
    ],
  },
  {
    label: "Categories",
    path: "/admin/customers",
    icon: MdOutlineRestaurantMenu,
  },
  {
    label: "Meal Types",
    path: "/admin/orders",
    icon: MdOutlineRestaurantMenu,
  },
  {
    label: "Orders",
    path: "/admin/deliveries",
    icon: MdShoppingCart,
  },
  {
    label: "Subscriptions",
    path: "/admin/reviews",
    icon: MdSubscriptions,
  },
  {
    label: "Payments",
    path: "/admin/revenue",
    icon: MdAttachMoney,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: MdSettings,
  },
];

// role -> menu map. Add more roles here if needed.
export const menuConfig = {
  ROLE_TIFFIN_PROVIDER: providerMenu,
  ROLE_ADMIN: adminMenu,
};

export const getMenuForRole = (role) => menuConfig[role] || [];

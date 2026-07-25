import React from 'react'
import { Route, Routes } from 'react-router'

import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'

import DashboardLayout from '../Components/layout/DashboardLayout'

import LoginPage from '../Pages/auth/Login/LoginPage'
import RegisterPage from '../Pages/auth/Register/RegisterPage'
import ForgotPasswordPage from '../Pages/auth/ForgotPassword/ForgotPasswordPage'

import AdminDashboardPage from '../Pages/Dashboard/AdminDashboardPage'
import AdminOrdersPage from '../Pages/admin/Orders/AdminOrdersPage'
import CustomersPage from '../Pages/admin/users/CustomersPage'
import CategoriesPage from '../Pages/admin/categories/CategoriesPage'
import AdminPaymentsPage from '../Pages/admin/Payments/AdminPaymentsPage'
import AdminSubscriptionsPage from '../Pages/admin/Subscriptions/AdminSubscriptionsPage'
import AdminProvidersPage from '../Pages/admin/users/Providers/AdminProvidersPage'
import AdminProviderMenuItemsPage from '../Pages/admin/users/Providers/AdminProviderMenuItemsPage'
import AdminProviderTiffinPlansPage from '../Pages/admin/users/Providers/AdminProviderTiffinPlansPage'
import AdminProviderHolidaysPage from '../Pages/admin/users/Providers/AdminProviderHolidaysPage'

import ProviderDashboardPage from '../Pages/Dashboard/ProviderDashboardPage'
import MenuItemsPage from '../Pages/provider/MenuItem/MenuItemsPage'
import TiffinPlansPage from '../Pages/provider/TiffinPlan/TiffinPlansPage'
import SubscriptionsPage from '../Pages/provider/Subscription/SubscriptionsPage'
import DailyDeliveriesPage from '../Pages/provider/Subscription/DailyDeliveriesPage'
import OrdersPage from '../Pages/provider/Order/OrdersPage'
import ProviderHolidaysPage from '../Pages/provider/provider-operations/ProviderHolidaysPage'
import ProviderMenusPage from '../Pages/provider/provider-operations/ProiderMenusPage'
import PaymentPage from '../Pages/provider/Revenue/PaymentPage'
import SettingsPage from '../Pages/Settings/SettingsPage'
import HomeRedirect from '../Pages/HomeRedirect'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path='/' element={<HomeRedirect />} />

        <Route path='/auth/login' element={<LoginPage />} />
        <Route path='/auth/register' element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
          <Route path='/admin/customers' element={<CustomersPage />} />
          <Route path='/admin/categories' element={<CategoriesPage />} />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
          <Route path='/admin/payments' element={<AdminPaymentsPage />} />
          <Route path='/admin/subscriptions' element={<AdminSubscriptionsPage />} />
          <Route path='/admin/providers' element={<AdminProvidersPage />} />

          <Route path="/admin/providers/:providerId/menu-items" element={<AdminProviderMenuItemsPage />} />
          <Route path="/admin/providers/:providerId/tiffin-plans" element={<AdminProviderTiffinPlansPage />} />
          <Route path="/admin/providers/:providerId/holidays" element={<AdminProviderHolidaysPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_TIFFIN_PROVIDER"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path='/settings' element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_TIFFIN_PROVIDER"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path='/provider/dashboard' element={<ProviderDashboardPage />} />
          <Route path='/provider/menu-items' element={<MenuItemsPage />} />
          <Route path='/provider/tiffin-plans' element={<TiffinPlansPage />} />
          <Route path='/provider/menus' element={<ProviderMenusPage />} />
          <Route path='/provider/orders' element={<OrdersPage />} />
          <Route path='/provider/subscriptions' element={<SubscriptionsPage />} />
          <Route path='/provider/daily-deliveries' element={<DailyDeliveriesPage />} />
          <Route path='/provider/holidays' element={<ProviderHolidaysPage />} />
          <Route path='/provider/payments' element={<PaymentPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
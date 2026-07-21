import React from 'react'
import { Route, Routes } from 'react-router'

import { AdminRevenue } from '../Admin/Pages/AdminRevenue'
import { AdminPaymentHistory } from '../Admin/Pages/AdminPaymentHistory'
import { Users } from '../Admin/Pages/Users'
import { TiffinProviders } from '../Admin/Pages/TiffinProvider/TiffinProviders'
import { ViewPlansOfProvider } from '../Admin/Pages/TiffinProvider/ViewPlansOfProvider'
import { ViewSingleTiffinPlan } from '../Admin/Pages/TiffinProvider/ViewSingleTiffinPlan'
import { ViewMenuItemProvider } from '../Admin/Pages/TiffinProvider/ViewMenuItemProvider'
import { AllTiffinPlans } from '../Admin/Pages/TiffinProvider/AllTiffinPlans'
import { AllMenuItems } from '../Admin/Pages/TiffinProvider/AllMenuItems'
import { ViewTiffinProvider } from '../Admin/Pages/TiffinProvider/ViewTiffinProvider'
import { ViewSingleUserInfo } from '../Admin/Pages/ViewSingleUserInfo'

import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'

import DashboardLayout from '../Components/layout/DashboardLayout'
import AdminDashboardPage from '../Pages/Dashboard/AdminDashboardPage'
import ProviderDashboardPage from '../Pages/Dashboard/ProviderDashboardPage'

import LoginPage from '../Pages/Login/LoginPage'
import RegisterPage from '../Pages/Register/RegisterPage'
import ForgotPasswordPage from '../Pages/ForgotPassword/ForgotPasswordPage'

import MenuItemsPage from '../Pages/MenuItem/MenuItemsPage'
import TiffinPlansPage from '../Pages/TiffinPlan/TiffinPlansPage'
import SubscriptionsPage from '../Pages/Subscription/SubscriptionsPage'
import DailyDeliveriesPage from '../Pages/Subscription/DailyDeliveriesPage'
import OrdersPage from '../Pages/Order/OrdersPage'
import ProviderHolidaysPage from '../Pages/provider/ProviderHolidaysPage'
import ProviderMenusPage from '../Pages/provider/ProiderMenusPage'
import PaymentPage from '../Pages/Revenue/PaymentPage'
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

          <Route path='/admin-revenue' element={<AdminRevenue />} />
          <Route path='/admin-payment-history' element={<AdminPaymentHistory />} />
          <Route path='/users' element={<Users />} />
          <Route path='/tiffin-providers' element={<TiffinProviders />} />
          <Route path='/tiffin-provider-plans' element={<ViewPlansOfProvider />} />
          <Route path='/tiffin-provider-plan' element={<ViewSingleTiffinPlan />} />
          <Route path='/tiffin-provider-menuitems' element={<ViewMenuItemProvider />} />
          <Route path='/all-tiffinplans' element={<AllTiffinPlans />} />
          <Route path='/all-menuitems' element={<AllMenuItems />} />
          <Route path='/tiffin-provider' element={<ViewTiffinProvider />} />
          <Route path='/user' element={<ViewSingleUserInfo />} />
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
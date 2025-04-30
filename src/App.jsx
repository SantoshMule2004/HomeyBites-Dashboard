import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { Dashboard } from './Pages/Dashboard/Dashboard';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MenuItem } from './Pages/MenuItem/MenuItem';
import { TiffinPlan } from './Pages/TiffinPlan/TiffinPlan';
import { Revenue } from './Pages/Revenue/Revenue';
import { Subscription } from './Pages/Subscription/Subscription';
import { AddTiffinPlan } from './Pages/TiffinPlan/AddTiffinPlan';
import { AddMenuItem } from './Pages/MenuItem/AddMenuItem';
import { AllOrders } from './Pages/Order/AllOrders';
import { TodayOrder } from './Pages/Order/TodayOrder';
import { ViewTiffinPlan } from './Pages/TiffinPlan/ViewTiffinPlan';
import { ViewUserSubscription } from './Pages/Subscription/ViewUserSubscription';
import Login from './Pages/login-signup/Login';
import { ToastContainer } from 'react-toastify';
import Signup from './Pages/login-signup/SignUp';
import VerifyOtp from './Pages/login-signup/VerifyOtp';
import ForgetPassword from './Pages/login-signup/forgetpassword';
import ResetPassword from './Pages/login-signup/ResetPassword';
import { UpdateTiffinPlan } from './Pages/TiffinPlan/UpdateTiffinPlan';
import { Base } from './Pages/Base/Base';
import BusinessDetails from './Pages/login-signup/BusinessDetails';
import { UserProfile } from './Pages/Profile/UserProfile';
import { UpdateBusinessDetails } from './Pages/Profile/UpdateBusinessDetails';
import { UpdateProfile } from './Pages/Profile/UpdateProfile';
import { LoginAndSecurity } from './Pages/Profile/LoginAndSecurity';
import { UpdateLS } from './Pages/Profile/UpdateLS';
import { AdminDashboard } from './Admin/Pages/AdminDashboard';
import { AdminLogin } from './Admin/Pages/AdminLogin';
import { Users } from './Admin/Pages/Users';
import { AllTiffinPlans } from './Admin/Pages/TiffinProvider/AllTiffinPlans';
import { TiffinProviders } from './Admin/Pages/TiffinProvider/TiffinProviders';
import { AllMenuItems } from './Admin/Pages/TiffinProvider/AllMenuItems';
import { ViewTiffinProvider } from './Admin/Pages/TiffinProvider/ViewTiffinProvider';
import { ViewSingleUserInfo } from './Admin/Pages/ViewSingleUserInfo';
import { ViewPlansOfProvider } from './Admin/Pages/TiffinProvider/ViewPlansOfProvider';
import { ViewMenuItemProvider } from './Admin/Pages/TiffinProvider/ViewMenuItemProvider';
import { ViewSingleTiffinPlan } from './Admin/Pages/TiffinProvider/ViewSingleTiffinPlan';

function App() {
  const location = useLocation();

  const authRoutes = ["/", "/register", "/verify-otp", "/forget-password", "/reset-password", "/business-details", "/admin-login"];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className='app'>
      <ToastContainer position='top-center' className="custom-toast-container" />
      {
        isAuthPage ? (
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/admin-login' element={<AdminLogin />} />
            <Route path='/register' element={<Signup />} />
            <Route path='/business-details' element={<BusinessDetails />} />
            <Route path='/verify-otp' element={<VerifyOtp />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
          </Routes>
        ) : (
          <Base>
            <Routes>
              <Route path='/update' element={<UpdateLS />} />
              <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/users' element={<Users />} />
              <Route path='/tiffin-providers' element={<TiffinProviders />} />
              <Route path='/tiffin-provider-plans' element={<ViewPlansOfProvider />} />
              <Route path='/tiffin-provider-plan' element={<ViewSingleTiffinPlan />} />
              <Route path='/tiffin-provider-menuitems' element={<ViewMenuItemProvider />} />
              <Route path='/all-tiffinplans' element={<AllTiffinPlans />} />
              <Route path='/all-menuitems' element={<AllMenuItems />} />
              <Route path='/tiffin-provider' element={<ViewTiffinProvider />} />
              <Route path='/user' element={<ViewSingleUserInfo />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/menuitem' element={<MenuItem />} />
              <Route path='/add-menuitem' element={<AddMenuItem />} />
              <Route path='/tiffinplan' element={<TiffinPlan />} />
              <Route path='/add-tiffinplan' element={<AddTiffinPlan />} />
              <Route path='/view-tiffinplan' element={<ViewTiffinPlan />} />
              <Route path='/update-tiffinplan' element={<UpdateTiffinPlan />} />
              <Route path='/revenue' element={<Revenue />} />
              <Route path='/user-subscription' element={<Subscription />} />
              <Route path='/view-user-subscription' element={<ViewUserSubscription />} />
              <Route path='/all-orders' element={<AllOrders />} />
              <Route path='/today-orders' element={<TodayOrder />} />
              <Route path='/profile' element={<UserProfile />} />
              <Route path='/update-business-details' element={<UpdateBusinessDetails />} />
              <Route path='/update-profile' element={<UpdateProfile />} />
              <Route path='/login-security' element={<LoginAndSecurity />} />
            </Routes>
          </Base>
        )
      }
    </div>
  )
}

export default App

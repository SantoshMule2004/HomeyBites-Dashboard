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
import { ViewMenuItem } from './Pages/MenuItem/ViewMenuItem';
import { ViewTiffinPlan } from './Pages/TiffinPlan/ViewTiffinPlan';
import { ViewUserSubscription } from './Pages/Subscription/ViewUserSubscription';
import Login from './Pages/login-signup/Login';
import { ToastContainer } from 'react-toastify';
import Signup from './Pages/login-signup/SignUp';
import VerifyOtp from './Pages/login-signup/VerifyOtp';
import ForgetPassword from './Pages/login-signup/forgetpassword';
import ResetPassword from './Pages/login-signup/ResetPassword';
import { isLoggedIn } from './Components/Auth/Index';
import NavigationBar from './Components/NavigationBar';
import { useEffect, useState } from 'react';
import { UpdateMenuItem } from './Pages/MenuItem/UpdateMenuItem';
import { UpdateTiffinPlan } from './Pages/TiffinPlan/UpdateTiffinPlan';
import { Base } from './Pages/Base/Base';
import BusinessDetails from './Pages/login-signup/BusinessDetails';
import { UserProfile } from './Pages/Profile/UserProfile';
import { UpdateBusinessDetails } from './Pages/Profile/UpdateBusinessDetails';
import { UpdateProfile } from './Pages/Profile/UpdateProfile';

function App() {
  const location = useLocation();

  const authRoutes = ["/", "/register", "/verify-otp", "/forget-password", "/reset-password", "/business-details"];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className='app'>
      <ToastContainer position='top-center' className="custom-toast-container" />
      {
        isAuthPage ? (
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Signup />} />
            <Route path='/business-details' element={<BusinessDetails />} />
            <Route path='/verify-otp' element={<VerifyOtp />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
          </Routes>
        ) : (
          <Base>
            <Routes>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/menuitem' element={<MenuItem />} />
              <Route path='/add-menuitem' element={<AddMenuItem />} />
              <Route path='/view-menuitem' element={<ViewMenuItem />} />
              <Route path='/update-menuitem' element={<UpdateMenuItem />} />
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
            </Routes>
          </Base>
        )
      }
    </div>
  )
}

export default App

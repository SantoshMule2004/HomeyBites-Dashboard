// src/layout/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";
import logo from '../../assets/images/logo.png';
import { useUserInfo } from "../../Context/UserContext";
import { getAllCategories } from "../../Services/menuService";
import { useMenuItems } from "../../Context/MenuItemContext";
import { getBusinessDetails } from "../../Services/userService";


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const { setCategories } = useMenuItems();

  const { doLogout, getUserInfo, setBusinessDetails } = useUserInfo();

  const user = getUserInfo()

  useEffect(() => {
    preFetch()
  }, [])

  const preFetch = () => {
    if (user?.userRole === "ROLE_TIFFIN_PROVIDER") {
      getAllCategories().then((response) => {
        setCategories(response)
        // console.log("Categories: ", response)
      }).catch((error) => {
        console.log(error)
      })

      getBusinessDetails(user?.userId).then((response) => {
        setBusinessDetails(response)
        console.log("fetched business details", response)
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  const role = user?.userRole

  const handleLogout = () => {
    doLogout(() => {
      // setLogin(false);
      navigate('/auth/login', { replace: true });
    });
    console.log("logout clicked");
  };

  return (
    <div className="hb-layout">
      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onLogout={handleLogout}
        logoSrc={logo}
      />

      <Sidebar role={role} isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="hb-layout__backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="hb-layout__content">
        <div className="hb-layout__content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
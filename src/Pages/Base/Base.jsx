import { NavBar } from '../../Components/NavBar'
import '../../Components/Style.css'
import NavigationBar from '../../Components/NavigationBar'
import { useEffect, useState } from 'react'
import { NavigationBarAdmin } from '../../Components/NavigationBarAdmin'
import { useNavigate } from 'react-router-dom'
import {useUserInfo} from '../../Context/UserContext'

export const Base = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdmin = localStorage.getItem("AdminLogin");
  console.log("Admin", isAdmin)

  const { isLoggedIn } = useUserInfo();

  const isLogin = isLoggedIn();

  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if(!isLogin){
      navigate("/")
    }
  }, [])

  return (
    <>
      <NavBar onToggleSidebar={toggleSidebar} />

     {/* Mobile overlay */}
     {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {
        isAdmin && (
          <NavigationBarAdmin isOpen={isSidebarOpen} onClose={closeSidebar} />
        ) 
        
      }
      {
        !isAdmin && (
          <NavigationBar isOpen={isSidebarOpen} onClose={closeSidebar} />
        )
      }

      <div className='Base min-vh-100 hide-scrollbar'>
        {children}
      </div>
    </>
  )
}

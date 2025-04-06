import { NavBar } from '../../Components/NavBar'
import '../../Components/Style.css'
import NavigationBar from '../../Components/NavigationBar'
import { useState } from 'react'

export const Base = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
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

      <NavigationBar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className='Base min-vh-100'>
        {children}
      </div>
    </>
  )
}

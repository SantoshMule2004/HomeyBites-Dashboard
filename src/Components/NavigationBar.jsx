import { useState } from "react";
import { Link } from "react-router-dom";

const NavigationBar = ({ isOpen, onClose }) => {
  const [openSections, setOpenSections] = useState({
    dashboard: false,
    tiffinplan: false,
    menuitem: false,
    subscription: false,
    orders: false,
    revenue: false,
    account: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      const newSections = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === section; // Set the clicked section to true, others to false
        return acc;
      }, {});
      return newSections;
    });
  };

  const [Active, setActive] = useState("dashboard");

  return (
    <div className={`flex-shrink-0 bg-dark SideBar ${isOpen ? 'open' : ''} p-3`}>
      <ul className="list-unstyled ps-0">

        {/* Dashboard Section */}
        <li className="mb-1">
          <Link to='/dashboard'><button onClick={() => {
            setActive("dashboard");
            toggleSection("dashboard");
          }} className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "dashboard" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#dashboard-collapse">Dashboard</button></Link>
        </li>

        <li className="divider my-3"></li>

        {/* Tiffin plan Section */}
        <li className="mb-1">
          <button onClick={() => {
            setActive("tiffinplan");
            toggleSection("tiffinplan");
          }} className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "tiffinplan" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#tiffinplan-collapse">Tiffin Plans</button>
          <div className={`collapse ${openSections.tiffinplan ? 'show' : ''}`} id="tiffinplan-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
              <li><i className="fa-solid fa-plus" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/add-tiffinplan" className="text-decoration-none rounded text-secondary">Add tiffin plan</Link></li>
              <li><i className="fa-solid fa-clipboard-list" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/tiffinplan" className="text-decoration-none rounded text-secondary">View tiffin plans</Link></li>
            </ul>
          </div>
        </li>

        {/* Menu item Section */}
        <li className="mb-1">
          <button onClick={() => {
            setActive("menuitem");
            toggleSection("menuitem");
          }}
           className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "menuitem" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#menuitem-collapse"> Menu items</button>
          <div className={`collapse ${openSections.menuitem ? 'show' : ''}`} id="menuitem-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
              <li><i className="fa-solid fa-plus" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/add-menuitem" className="text-decoration-none rounded text-secondary">Add menu item</Link></li>
              <li><i className="fa-solid fa-bell-concierge" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/menuitem" className="text-decoration-none rounded text-secondary">View menu items</Link></li>
            </ul>
          </div>
        </li>

        {/* Subscription Section */}
        <li className="mb-1">
          <button onClick={() => {
            setActive("subscription");
            toggleSection("subscription");
          }}
           className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "subscription" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#subscription-collapse"> Subscriptions</button>
          <div className={`collapse ${openSections.subscription ? 'show' : ''}`} id="subscription-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
              <li><i className="fa-solid fa-user-check" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/user-subscription" className="text-decoration-none rounded text-secondary">View subscriptions</Link></li>
            </ul>
          </div>
        </li>

        <li className="divider my-3"></li>

        {/* Orders Section */}
        <li className="mb-1">
          <button onClick={() => {
            setActive("order");
            toggleSection("orders");
          }}
           className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "order" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#orders-collapse"> Orders</button>
          <div className={`collapse ${openSections.orders ? 'show' : ''}`} id="orders-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
              <li><i className="fa-solid fa-circle-check" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/today-orders" className="text-decoration-none rounded text-secondary">Today`s Orders</Link></li>
              <li><i className="fa-solid fa-rectangle-list" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/all-orders" className="text-decoration-none rounded text-secondary">All Orders</Link></li>
            </ul>
          </div>
        </li>

        {/* Revenue Section */}
        <li className="mb-1">
          <button onClick={() => {
            setActive("revenue");
            toggleSection("revenue");
          }}
           className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "revenue" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#revenue-collapse"> Revenue</button>
          <div className={`collapse ${openSections.revenue ? 'show' : ''}`} id="revenue-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
              <li><i className="fa-solid fa-wallet" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/revenue" className="text-decoration-none rounded text-secondary">revenue</Link></li>
              <li><i className="fa-solid fa-coins" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="#" className="text-decoration-none rounded text-secondary">Payment history</Link></li>
            </ul>
          </div>
        </li>

        <li className="divider my-3"></li>

        {/* Account Section */}
        <li className="mb-1">
          <Link to='#'>  <button onClick={() => {
            setActive("account");
            toggleSection("account");
          }}
           className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "account" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#account-collapse"> Settings</button></Link>
        </li>
      </ul>
    </div>
  );
};

export default NavigationBar;

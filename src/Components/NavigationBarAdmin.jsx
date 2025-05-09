import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export const NavigationBarAdmin = ({ isOpen, onClose }) => {
    const [openSections, setOpenSections] = useState({
        dashboard: false,
        users: false,
        tiffinProvider: false,
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
                    <Link to='/admin-dashboard'><button onClick={() => {
                        setActive("dashboard");
                        toggleSection("dashboard");
                    }} className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "dashboard" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#dashboard-collapse">Dashboard</button></Link>
                </li>

                <li className="divider my-3"></li>

                {/* User Section */}
                <li className="mb-1">
                    <Link to='/users'><button onClick={() => {
                        setActive("users");
                        toggleSection("users");
                    }} className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "users" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#dashboard-collapse">Users</button></Link>
                </li>

                {/* tiffin provider Section */}
                <li className="mb-1">
                <Link to='/tiffin-providers'><button onClick={() => {
                        setActive("tiffinProvider");
                        toggleSection("tiffinProvider");
                    }}
                        className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "tiffinProvider" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#menuitem-collapse" >{openSections.tiffinProvider ? (<i className="fa-solid fa-caret-down"></i>) : (<i className="fa-solid fa-caret-right"></i>)}&nbsp;&nbsp; Tiffin providers</button></Link>
                    <div className={`collapse ${openSections.tiffinProvider ? 'show' : ''}`} id="menuitem-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
                            <li><i className="fa-solid fas fa-bowl-food" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/all-tiffinplans" className="text-decoration-none rounded text-secondary">View tiffinplan</Link></li>
                            <li><i className="fa-solid fa-bell-concierge" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/all-menuitems" className="text-decoration-none rounded text-secondary">View menuitems</Link></li>
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
                        className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "order" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#orders-collapse">{openSections.orders ? (<i className="fa-solid fa-caret-down"></i>) : (<i className="fa-solid fa-caret-right"></i>)}&nbsp;&nbsp; Orders</button>
                    <div className={`collapse ${openSections.orders ? 'show' : ''}`} id="orders-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
                            <li><i className="fa-solid fa-circle-check" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/today-orders" className="text-decoration-none rounded text-secondary">Today’s Orders</Link></li>
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
                        className={`btn sidebar-btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white ${Active === "revenue" ? "active" : ""}`} data-bs-toggle="collapse" data-bs-target="#revenue-collapse">{openSections.revenue ? (<i className="fa-solid fa-caret-down"></i>) : (<i className="fa-solid fa-caret-right"></i>)}&nbsp;&nbsp; Revenue</button>
                    <div className={`collapse ${openSections.revenue ? 'show' : ''}`} id="revenue-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small" style={{ marginLeft: '20px' }}>
                            <li><i className="fa-solid fa-wallet" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/admin-revenue" className="text-decoration-none rounded text-secondary">revenue</Link></li>
                            <li><i className="fa-solid fa-coins" style={{ color: '#7e7c7c', marginRight: '5px', paddingBottom: '10px', paddingTop: '10px' }}></i><Link to="/admin-payment-history" className="text-decoration-none rounded text-secondary">Payment history</Link></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
}

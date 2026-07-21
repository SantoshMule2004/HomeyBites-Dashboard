// src/layout/Sidebar.jsx
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { getMenuForRole } from '../../utils/menuConfig';
import "./Sidebar.css";

/**
 * Sidebar
 * Props:
 *  - role: "provider" | "admin"  (pass user.role from your AuthContext)
 *  - isOpen: boolean  (controls mobile slide-in / collapsed state)
 */
export default function Sidebar({ role, isOpen, onNavigate }) {
  const menuItems = getMenuForRole(role);
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  // Auto-expand (and keep highlighted) any parent whose child route is active,
  // so navigating directly to a sub-page still shows the right context open.
  useEffect(() => {
    const next = {};
    menuItems.forEach((item) => {
      if (item.children?.some((child) => child.path === location.pathname)) {
        next[item.label] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...next }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className={`hb-sidebar ${isOpen ? "hb-sidebar--open" : ""}`}>
      <nav className="hb-sidebar__nav">
        <ul className="hb-sidebar__list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;

            if (!hasChildren) {
              return (
                <li key={item.label} className="hb-sidebar__item">
                  <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `hb-sidebar__link ${isActive ? "hb-sidebar__link--active" : ""}`
                    }
                  >
                    <Icon className="hb-sidebar__icon" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            }

            const isMenuOpen = !!openMenus[item.label];
            const isChildActive = item.children.some(
              (child) => child.path === location.pathname
            );

            return (
              <li key={item.label} className="hb-sidebar__item">
                <button
                  type="button"
                  className={`hb-sidebar__link hb-sidebar__link--parent ${
                    isChildActive ? "hb-sidebar__link--parent-active" : ""
                  }`}
                  onClick={() => toggleSubMenu(item.label)}
                  aria-expanded={isMenuOpen}
                >
                  <Icon className="hb-sidebar__icon" />
                  <span>{item.label}</span>
                  <MdKeyboardArrowRight
                    className={`hb-sidebar__chevron ${
                      isMenuOpen ? "hb-sidebar__chevron--open" : ""
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <ul className="hb-sidebar__submenu">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <NavLink
                          to={child.path}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            `hb-sidebar__sublink ${
                              isActive ? "hb-sidebar__sublink--active" : ""
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
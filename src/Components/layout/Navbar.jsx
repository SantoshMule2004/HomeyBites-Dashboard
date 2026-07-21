// src/layout/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { MdMenu, MdKeyboardArrowDown, MdPerson, MdLogout } from "react-icons/md";
import "./Navbar.css";

/**
 * Navbar
 * Props:
 *  - user: { name, avatarUrl? }   (from your AuthContext)
 *  - onToggleSidebar: () => void  (used for mobile hamburger)
 *  - onLogout: () => void         (optional, wire to your auth logout)
 *  - logo, brandName: optional overrides for branding
 */
export default function Navbar({
  user,
  onToggleSidebar,
  onLogout,
  logoSrc,
  brandName = "HomeyBites",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close the dropdown on any click outside of it, or on Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="hb-navbar">
      <div className="hb-navbar__left">
        <button
          type="button"
          className="hb-navbar__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MdMenu />
        </button>

        <div className="hb-navbar__brand">
          {logoSrc && <img src={logoSrc} alt={brandName} className="hb-navbar__logo" />}
          <span className="hb-navbar__brand-name">{brandName}</span>
        </div>
      </div>

      <div className="hb-navbar__right">
        <div
          className="hb-navbar__user"
          ref={userMenuRef}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user?.businessName} className="hb-navbar__avatar" />
          ) : (
            <MdPerson className="hb-navbar__avatar-icon" />
          )}
          <span className="hb-navbar__username">{user?.userRole === "ROLE_ADMIN" ? `${user?.firstName} ${user?.lastName}` : user?.businessName || "User"}</span>
          <MdKeyboardArrowDown
            className={`hb-navbar__caret ${menuOpen ? "hb-navbar__caret--open" : ""}`}
          />

          {menuOpen && (
            <div className="hb-navbar__dropdown">
              <button
                type="button"
                className="hb-navbar__dropdown-item"
                onClick={onLogout}
              >
                <MdLogout /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
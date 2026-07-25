// src/components/tables/KebabMenu.jsx
//
// "Three dots" button that opens a small dropdown of options — for rows
// that need several actions but shouldn't show them all as separate icon
// buttons (e.g. a list of "View X" options that don't fit the
// update/enable/disable/delete icon pattern used elsewhere).
//
// Usage:
//   <KebabMenu
//     options={[
//       { label: "View Menu Items", icon: FaUtensils, onClick: () => setMenuItemsTarget(provider) },
//       { label: "View Tiffin Plans", icon: FaClipboardList, onClick: () => setPlansTarget(provider) },
//     ]}
//   />

import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../common/Common.css";

export default function KebabMenu({ options }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="hb-kebab" ref={menuRef}>
      <button
        type="button"
        className="hb-kebab__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="More actions"
      >
        <BsThreeDotsVertical />
      </button>

      {open && (
        <div className="hb-kebab__menu" role="menu">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              role="menuitem"
              className="hb-kebab__item"
              onClick={() => {
                setOpen(false);
                option.onClick();
              }}
            >
              {option.icon && <option.icon className="hb-kebab__item-icon" />}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

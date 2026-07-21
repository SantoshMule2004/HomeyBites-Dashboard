// src/components/common/Accordion.jsx
//
// Generic accordion. By default only one section can be open at a time
// (opening one closes whatever else was open) — pass `exclusive={false}`
// if you ever want multiple sections open simultaneously instead.
//
// Usage:
//   <Accordion defaultOpen="general">
//     <AccordionItem id="general" title="General" icon={FaUser}>
//       ...section content...
//     </AccordionItem>
//     <AccordionItem id="business" title="Business Information" icon={FaStore}>
//       ...
//     </AccordionItem>
//   </Accordion>
//
// `defaultOpen` accepts a single id (exclusive mode) or an array of ids
// (non-exclusive mode).

import { createContext, useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./Common.css";

const AccordionContext = createContext(null);

export function Accordion({ children, defaultOpen = null, exclusive = true }) {
  const initial = exclusive
    ? defaultOpen // a single id, or null for none open
    : Array.isArray(defaultOpen)
    ? defaultOpen
    : defaultOpen
    ? [defaultOpen]
    : [];

  const [openState, setOpenState] = useState(initial);

  const toggle = (id) => {
    if (exclusive) {
      setOpenState((prev) => (prev === id ? null : id));
    } else {
      setOpenState((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }
  };

  const isOpen = (id) => (exclusive ? openState === id : openState.includes(id));

  return (
    <div className="hb-accordion">
      <AccordionContext.Provider value={{ isOpen, toggle }}>{children}</AccordionContext.Provider>
    </div>
  );
}

export function AccordionItem({ id, title, icon: Icon, subtitle, children }) {
  const { isOpen, toggle } = useContext(AccordionContext);
  const open = isOpen(id);

  return (
    <div className={`hb-accordion-item ${open ? "hb-accordion-item--open" : ""}`}>
      <button
        type="button"
        className="hb-accordion-item__header"
        onClick={() => toggle(id)}
        aria-expanded={open}
      >
        <span className="hb-accordion-item__heading">
          {Icon && <Icon className="hb-accordion-item__icon" />}
          <span>
            <span className="hb-accordion-item__title">{title}</span>
            {subtitle && <span className="hb-accordion-item__subtitle">{subtitle}</span>}
          </span>
        </span>
        <FaChevronDown
          className={`hb-accordion-item__chevron ${open ? "hb-accordion-item__chevron--open" : ""}`}
        />
      </button>

      {open && <div className="hb-accordion-item__body">{children}</div>}
    </div>
  );
}

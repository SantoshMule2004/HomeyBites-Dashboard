// src/components/common/PageHeader.jsx
//
// The title + optional action-button row at the top of every list page
// (Menu Items, Tiffin Plans, Orders, Dashboards, ...). Replaces each page
// having its own near-identical "__header"/"__title" markup and CSS.
//
// Usage:
//   <PageHeader title="Menu Items" action={
//     <button type="button" className="btn hb-btn-primary" onClick={openAddModal}>
//       <FaPlus className="me-2" /> Add New Item
//     </button>
//   } />
//
//   <PageHeader title="Dashboard" />   // no action needed — title only

import "./Common.css";

export default function PageHeader({ title, action }) {
  return (
    <div className="hb-page-header">
      <h1 className="hb-page-header__title">{title}</h1>
      {action}
    </div>
  );
}

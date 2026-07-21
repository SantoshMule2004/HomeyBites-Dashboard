// src/components/dashboard/StatCard.jsx
//
// A single dashboard stat card — icon, big value, label underneath.
// Use via <StatCardsGrid /> for a row of these, or standalone.

import "./Dashboard.css";

export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="hb-card hb-stat-card">
      {Icon && (
        <div className="hb-stat-card__icon">
          <Icon />
        </div>
      )}
      <div className="hb-stat-card__body">
        <div className="hb-stat-card__value">{value}</div>
        <div className="hb-stat-card__label">{label}</div>
      </div>
    </div>
  );
}

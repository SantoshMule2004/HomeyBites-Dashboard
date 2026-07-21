// src/components/dashboard/StatCardsGrid.jsx
//
// Responsive grid of <StatCard />s — pass an array of
// { label, value, icon }, it lays them out and wraps automatically.
//
// Usage:
//   <StatCardsGrid cards={[
//     { label: "Today's Revenue", value: `₹ ${data.todayRevenue}`, icon: FaRupeeSign },
//     { label: "Today's Orders", value: data.todayOrders, icon: FaShoppingBag },
//   ]} />

import StatCard from "./StatCard";
import "./Dashboard.css";

export default function StatCardsGrid({ cards }) {
  return (
    <div className="hb-stat-grid">
      {cards.map((card) => (
        <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} />
      ))}
    </div>
  );
}

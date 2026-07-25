// src/components/dashboard/RevenueChart.jsx
//
// Line chart for RevenueChartProjection[]: { period, revenue, paymentCount,
// refundCount }. Plots revenue over `period`; the tooltip also surfaces
// paymentCount/refundCount for whichever point is hovered.

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./Dashboard.css";
import { formatPrice } from "../../utils/formatPrice";

function RevenueTooltip({ active, payload, label, yKey }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="hb-revenue-chart__tooltip">
      <div className="hb-revenue-chart__tooltip-label">{label}</div>
      <div>Revenue: {formatPrice(point[yKey])}</div>
      {point.paymentCount !== undefined && <div>Payments: {point.paymentCount}</div>}
      {point.refundCount !== undefined && <div>Refunds: {point.refundCount}</div>}
    </div>
  );
}

export default function RevenueChart({ data = [], title = "Revenue Trend", xKey = "period", yKey = "revenue" }) {
  return (
    <div className="hb-card hb-revenue-chart">
      <h5 className="hb-revenue-chart__title">{title}</h5>
      {data.length === 0 ? (
        <div className="hb-revenue-chart__empty">No revenue data for this period.</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<RevenueTooltip yKey={yKey} />} />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="var(--hb-accent, #ff7a1a)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
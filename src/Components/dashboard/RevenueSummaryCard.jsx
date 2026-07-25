// src/components/dashboard/RevenueSummaryCard.jsx
//
// Summarizes RevenueSummaryProjection: net revenue as the headline number,
// gross/refunded underneath, and a breakdown of payment counts by status.

import { formatPrice } from "../../utils/formatPrice";
import "./Dashboard.css";

export default function RevenueSummaryCard({ summary }) {
  if (!summary) return null;

  const {
    grossRevenue = 0,
    refundedAmount = 0,
    netRevenue = 0,
    successfulPayments = 0,
    pendingPayments = 0,
    failedPayments = 0,
    refundedPayments = 0,
  } = summary;

  return (
    <div className="hb-card hb-revenue-summary">
      <div className="hb-revenue-summary__label">Net Revenue</div>
      <div className="hb-revenue-summary__value">{formatPrice(netRevenue)}</div>

      <div className="hb-revenue-summary__breakdown">
        <div className="hb-revenue-summary__breakdown-row">
          <span>Gross Revenue</span>
          <span>{formatPrice(grossRevenue)}</span>
        </div>
        <div className="hb-revenue-summary__breakdown-row">
          <span>Refunded</span>
          <span>{formatPrice(refundedAmount)}</span>
        </div>
      </div>

      <div className="hb-revenue-summary__chips">
        <span className="hb-revenue-summary__chip hb-revenue-summary__chip--success">
          {successfulPayments} Successful
        </span>
        <span className="hb-revenue-summary__chip hb-revenue-summary__chip--warning">
          {pendingPayments} Pending
        </span>
        <span className="hb-revenue-summary__chip hb-revenue-summary__chip--danger">
          {failedPayments} Failed
        </span>
        <span className="hb-revenue-summary__chip hb-revenue-summary__chip--neutral">
          {refundedPayments} Refunded
        </span>
      </div>
    </div>
  );
}
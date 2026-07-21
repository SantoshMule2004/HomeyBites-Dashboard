// src/pages/Dashboard/AdminDashboardPage.jsx
//
// Admin's dashboard home: 8 stat cards, a revenue summary + trend chart,
// and four "recent activity" tables (Orders, Payments, Users, Providers)
// — all from one AdminDashboardDTO fetched on load.

import { useCallback, useEffect, useState } from "react";
import {
  FaUsers,
  FaStore,
  FaCheckCircle,
  FaShoppingBag,
  FaClock,
  FaUserFriends,
  FaRupeeSign,
  FaChartLine,
} from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import StatCardsGrid from "../../components/dashboard/StatCardsGrid";
import RevenueFilterBar from "../../components/dashboard/RevenueFilterBar";
import RevenueChart from "../../components/dashboard/RevenueChart";
import RevenueSummaryCard from "../../components/dashboard/RevenueSummaryCard";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/tables/StatusBadge";
import { getAdminDashboard, getAdminRevenueDashboard } from "../../Services/DashboardService";
import { ORDER_STATUS_META, PAYMENT_STATUS_META, getStatusMeta } from "../../utils/config";
import "./Dashboard.css";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Revenue summary + chart start out from the main dashboard response
  // (its default "this week" data) — the dedicated revenue endpoint is
  // only called once the user actually changes groupBy/date via
  // <RevenueFilterBar />, not on initial load.
  const [revenueFilter, setRevenueFilter] = useState(null);
  const [revenueData, setRevenueData] = useState(null); // { revenueSummary, revenueChart }
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState(null);

  const fetchDashboard = useCallback(() => {
    setLoading(true);
    setError(null);

    return getAdminDashboard()
      .then((response) => {
        setDashboard(response.classObj);
        setRevenueData({
          revenueSummary: response.classObj.revenueSummary,
          revenueChart: response.classObj.revenueChart,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load the dashboard. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchRevenue = useCallback((filter) => {
    if (!filter) return Promise.resolve();

    setRevenueLoading(true);
    setRevenueError(null);

    return getAdminRevenueDashboard(filter)
      .then((response) => setRevenueData(response.classObj))
      .catch((err) => {
        console.error(err);
        setRevenueError("Couldn't load revenue data. Please try again.");
      })
      .finally(() => setRevenueLoading(false));
  }, []);

  const handleRevenueFilterChange = useCallback(
    (filter) => {
      setRevenueFilter(filter);
      fetchRevenue(filter);
    },
    [fetchRevenue]
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="hb-dashboard__loading-wrap">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hb-dashboard__error-wrap">
        <ErrorState message={error} onRetry={fetchDashboard} />
      </div>
    );
  }

  if (!dashboard) return null;

  const cards = [
    { label: "Total Users", value: dashboard.totalUsers ?? 0, icon: FaUsers },
    { label: "Total Providers", value: dashboard.totalProviders ?? 0, icon: FaStore },
    { label: "Active Providers", value: dashboard.activeProviders ?? 0, icon: FaCheckCircle },
    { label: "Today's Orders", value: dashboard.todayOrders ?? 0, icon: FaShoppingBag },
    { label: "Pending Orders", value: dashboard.pendingOrders ?? 0, icon: FaClock },
    { label: "Active Subscriptions", value: dashboard.activeSubscriptions ?? 0, icon: FaUserFriends },
    { label: "Today's Revenue", value: `₹ ${dashboard.todayRevenue ?? 0}`, icon: FaRupeeSign },
    { label: "Avg. Order Value", value: `₹ ${dashboard.averageOrderValue ?? 0}`, icon: FaChartLine },
  ];

  // RecentOrderProjection: providerOrderId, customerOrderId, customerName,
  // amount, fulfillmentStatus, createdAt.
  const recentOrderColumns = [
    {
      key: "id",
      header: "Order",
      render: (order) => <span className="hb-table__name">#{order.providerOrderId}</span>,
    },
    { key: "customer", header: "Customer", render: (order) => order.customerName },
    { key: "amount", header: "Amount", render: (order) => `₹ ${order.amount}` },
    {
      key: "status",
      header: "Status",
      render: (order) => {
        const meta = getStatusMeta(ORDER_STATUS_META, order.fulfillmentStatus);
        return <StatusBadge label={meta.label} variant={meta.variant} />;
      },
    },
  ];

  // RecentPaymentProjection: paymentId, customerName, providerName, amount,
  // paymentMethod, paymentStatus, paidAt.
  const recentPaymentColumns = [
    { key: "customer", header: "Customer", render: (payment) => payment.customerName },
    { key: "provider", header: "Provider", render: (payment) => payment.providerName },
    { key: "amount", header: "Amount", render: (payment) => `₹ ${payment.amount}` },
    {
      key: "status",
      header: "Status",
      render: (payment) => {
        const meta = getStatusMeta(PAYMENT_STATUS_META, payment.paymentStatus);
        return <StatusBadge label={meta.label} variant={meta.variant} />;
      },
    },
    {
      key: "paidAt",
      header: "Paid At",
      render: (payment) => (payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "—"),
    },
  ];

  // RecentUserProjection: userId, userName, emailId, createdAt.
  const recentUserColumns = [
    { key: "name", header: "Name", render: (u) => u.userName },
    { key: "email", header: "Email", render: (u) => u.emailId },
    {
      key: "joinedAt",
      header: "Joined",
      render: (u) => (u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"),
    },
  ];

  // RecentProviderProjection: providerId, businessName, ownerName, emailId,
  // active, createdAt.
  const recentProviderColumns = [
    { key: "business", header: "Business", render: (p) => p.businessName },
    { key: "owner", header: "Owner", render: (p) => p.ownerName },
    {
      key: "joinedAt",
      header: "Joined",
      render: (p) => (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"),
    },
    // {
    //   key: "status",
    //   header: "Status",
    //   render: (p) => (
    //     <StatusBadge label={p.active ? "Active" : "Inactive"} variant={p.active ? "success" : "danger"} />
    //   ),
    // },
  ];

  return (
    <div>
      <PageHeader title="Admin Dashboard" />

      <StatCardsGrid cards={cards} />

      <div className="hb-revenue-header">
        <h5 className="hb-dashboard__section-title">Revenue</h5>
        <RevenueFilterBar onFilterChange={handleRevenueFilterChange} />
      </div>

      {revenueLoading ? (
        <div className="hb-dashboard__revenue-row">
          <div className="hb-card hb-revenue-summary">
            <LoadingSpinner message="Loading revenue..." />
          </div>
          <div className="hb-card hb-revenue-chart">
            <LoadingSpinner message="Loading chart..." />
          </div>
        </div>
      ) : revenueError ? (
        <ErrorState message={revenueError} onRetry={() => fetchRevenue(revenueFilter)} />
      ) : (
        <div className="hb-dashboard__revenue-row">
          <RevenueSummaryCard summary={revenueData?.revenueSummary} />
          <RevenueChart data={revenueData?.revenueChart} />
        </div>
      )}

      <div className="hb-dashboard__tables-row">
        <div className="hb-dashboard__table-col">
          <h5 className="hb-dashboard__section-title">Recent Orders</h5>
          <DataTable
            columns={recentOrderColumns}
            data={dashboard.recentOrders ?? []}
            rowKey={(order) => order.providerOrderId}
            emptyMessage="No recent orders."
          />
        </div>
        <div className="hb-dashboard__table-col">
          <h5 className="hb-dashboard__section-title">Recent Payments</h5>
          <DataTable
            columns={recentPaymentColumns}
            data={dashboard.recentPayments ?? []}
            rowKey={(payment) => payment.paymentId}
            emptyMessage="No recent payments."
          />
        </div>
        <div className="hb-dashboard__table-col">
          <h5 className="hb-dashboard__section-title">Recent Users</h5>
          <DataTable
            columns={recentUserColumns}
            data={dashboard.recentUsers ?? []}
            rowKey={(u) => u.userId}
            emptyMessage="No recent users."
          />
        </div>
        <div className="hb-dashboard__table-col">
          <h5 className="hb-dashboard__section-title">Recent Providers</h5>
          <DataTable
            columns={recentProviderColumns}
            data={dashboard.recentProviders ?? []}
            rowKey={(p) => p.providerId}
            emptyMessage="No recent providers."
          />
        </div>
      </div>
    </div>
  );
}

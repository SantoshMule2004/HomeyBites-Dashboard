// src/pages/Dashboard/ProviderDashboardPage.jsx
//
// Provider's dashboard home: 8 stat cards, a revenue summary + trend chart,
// and two "recent activity" tables (Orders, Subscriptions) — all from one
// ProviderDashboardDTO fetched on load.

import { useCallback, useEffect, useState } from "react";
import {
  FaRupeeSign,
  FaShoppingBag,
  FaClock,
  FaUsers,
  FaCalendarDay,
  FaUtensils,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import LoadingSpinner from "../../Components/common/LoadingSpinner";
import ErrorState from "../../Components/common/ErrorState";
import PageHeader from "../../Components/common/PageHeader";
import StatCardsGrid from "../../Components/dashboard/StatCardsGrid";
import RevenueFilterBar from "../../Components/dashboard/RevenueFilterBar";
import RevenueChart from "../../Components/dashboard/RevenueChart";
import RevenueSummaryCard from "../../Components/dashboard/RevenueSummaryCard";
import DataTable from "../../Components/tables/DataTable";
import StatusBadge from "../../Components/tables/StatusBadge";
import { useUserInfo } from "../../Context/UserContext";
import { getProviderDashboard, getProviderRevenueDashboard } from "../../Services/dashboardService";
import { ORDER_STATUS_META, getStatusMeta } from "../../utils/config";
import { guessStatusVariant } from "../../utils/statusVariant";
import "./Dashboard.css";

export default function ProviderDashboardPage() {
  const { getUserInfo } = useUserInfo();
  const user = getUserInfo();
  const providerId = user?.userId;

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
    if (!providerId) return Promise.resolve();

    setLoading(true);
    setError(null);

    return getProviderDashboard(providerId)
      .then((response) => {
        setDashboard(response.classObj);
        setRevenueData({
          revenueSummary: response.classObj.revenueSummary,
          revenueChart: response.classObj.revenueChart,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your dashboard. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [providerId]);

  const fetchRevenue = useCallback((filter) => {
    if (!filter) return Promise.resolve();

    setRevenueLoading(true);
    setRevenueError(null);

    return getProviderRevenueDashboard(filter)
      .then((response) => setRevenueData(response.classObj))
      .catch((err) => {
        console.error(err);
        setRevenueError("Couldn't load revenue data. Please try again.");
      })
      .finally(() => setRevenueLoading(false));
  }, []);

  // Called by <RevenueFilterBar /> — once on mount with its default filter,
  // and again any time groupBy/date selection changes.
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
    { label: "Today's Revenue", value: `₹ ${dashboard.todayRevenue ?? 0}`, icon: FaRupeeSign },
    { label: "Today's Orders", value: dashboard.todayOrders ?? 0, icon: FaShoppingBag },
    { label: "Pending Orders", value: dashboard.pendingOrders ?? 0, icon: FaClock },
    { label: "Active Subscriptions", value: dashboard.activeSubscriptions ?? 0, icon: FaUsers },
    { label: "Today's Subscriptions", value: dashboard.todaySubscriptions ?? 0, icon: FaCalendarDay },
    { label: "Total Menu Items", value: dashboard.totalMenuItems ?? 0, icon: FaUtensils },
    { label: "Active Plans", value: dashboard.activePlans ?? 0, icon: FaClipboardList },
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
    {
      key: "createdAt",
      header: "Placed At",
      render: (order) => (order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"),
    },
  ];

  // RecentSubscriptionProjection: subscriptionId, customerName, planName,
  // startDate, currentEndDate, status.
  const recentSubscriptionColumns = [
    { key: "customer", header: "Customer", render: (sub) => sub.customerName },
    { key: "plan", header: "Plan", render: (sub) => sub.planName },
    {
      key: "startDate",
      header: "Start Date",
      render: (sub) => (sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "—"),
    },
    {
      key: "endDate",
      header: "Ends",
      render: (sub) => (sub.currentEndDate ? new Date(sub.currentEndDate).toLocaleDateString() : "—"),
    },
    {
      key: "status",
      header: "Status",
      render: (sub) => <StatusBadge label={sub.status} variant={guessStatusVariant(sub.status)} />,
    },
  ];

  // RecentHolidaysProjection: subscriptionId, customerName, planName,
  // startDate, currentEndDate, status.
  const recentHolidaysColumns = [
    { key: "name", header: "Name", render: (holiday) => holiday.name },
    { key: "description", header: "Description", render: (holiday) => holiday.description },
    {
      key: "closedDate",
      header: "Closed Date",
      render: (holiday) => (holiday.closedDate ? new Date(holiday.closedDate).toLocaleDateString() : "—"),
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" />

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
          <h5 className="hb-dashboard__section-title">Recent Subscriptions</h5>
          <DataTable
            columns={recentSubscriptionColumns}
            data={dashboard.recentSubscriptions ?? []}
            rowKey={(sub) => sub.subscriptionId}
            emptyMessage="No recent subscriptions."
          />
        </div>
         <div className="hb-dashboard__table-col">
          <h5 className="hb-dashboard__section-title">Recent Holidays</h5>
          <DataTable
            columns={recentHolidaysColumns}
            data={dashboard.recentHolidays ?? []}
            rowKey={(holiday) => holiday.id}
            emptyMessage="No recent hollidays."
          />
        </div>
      </div>
    </div>
  );
}
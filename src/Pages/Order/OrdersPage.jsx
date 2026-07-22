// src/pages/Orders/OrdersPage.jsx
//
// Table-based Orders page, built from the same reusable pieces as Menu
// Items / Tiffin Plans (src/Components/tables/ + src/Components/common/).
//
// Providers can't create, edit, or delete orders — the only actions here
// are updating an order's fulfillment status and viewing its items. Status
// is shown with a colored badge instead of Active/Inactive.
//
// Date filter defaults to "today" (Date Range, both ends = today) since
// your getProviderOrders endpoint already returns today's orders when no
// date filter is sent — this just makes that default visible/adjustable in
// the UI instead of it being an invisible backend default.

import { useCallback, useEffect, useState } from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import FiltersBar from "../../Components/tables/FiltersBar";
import DateFilter from "../../Components/tables/DateFilter";
import DataTable from "../../Components/tables/DataTable";
import StatusBadge from "../../Components/tables/StatusBadge";
import TableActionButton from "../../Components/tables/TableActionButton";
import ErrorState from "../../Components/common/ErrorState";
import PageHeader from "../../Components/common/PageHeader";
import OrderItemsModal from "./OrderItemsModal";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_META,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_STATUS_META,
  getStatusMeta,
} from "../../utils/config";
import "./Orders.css";
import { useUserInfo } from "../../Context/UserContext";
import { getProviderOrders, updateOrderStatus } from "../../Services/orderService";

const PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 500;

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function OrdersPage() {
  const { getUserInfo } = useUserInfo();
  const user = getUserInfo();
  const providerId = user?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");

  // Defaults to "today" (both ends of the range = today), matching what
  // getProviderOrders already returns when no date filter is sent.
  const [dateMode, setDateMode] = useState("TODAY");
  const [fromDate, setFromDate] = useState(todayIso());
  const [toDate, setToDate] = useState(todayIso());

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [viewTarget, setViewTarget] = useState(null); // order to show items for
  const [statusTarget, setStatusTarget] = useState(null); // order to update status for

  const fetchOrders = useCallback(() => {
    if (!providerId) return Promise.resolve();

    const filters = {
      status: orderStatusFilter === "ALL" ? null : orderStatusFilter,
      paymentStatus: paymentStatusFilter === "ALL" ? null : paymentStatusFilter,
      receiverName: search.trim() === "" ? null : search.trim(),
      startDate: dateMode === "ALL" ? null : fromDate || null,
      endDate: dateMode === "RANGE" ? toDate || null : null,
    };

    setLoading(true);
    setError(null);

    // 👇 Extend getProviderOrders in OrderService.js to accept page/size and
    // pass them through as query params, alongside the OrderFilterDto fields.
    return getProviderOrders(providerId, filters, page, PAGE_SIZE)
      .then((response) => {
        setOrders(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.message ? err?.response?.data?.message : "Couldn't load your orders. Please check your connection and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [providerId, orderStatusFilter, paymentStatusFilter, search, dateMode, fromDate, toDate, page]);

  useEffect(() => {
    setPage(0);
  }, [orderStatusFilter, paymentStatusFilter, search, dateMode, fromDate, toDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [fetchOrders]);

  // "Reset" clears every filter, including the date — unlike the initial
  // page load, an explicit reset means "show me everything," not "today."
  const handleResetFilters = () => {
    setSearch("");
    setOrderStatusFilter("ALL");
    setPaymentStatusFilter("ALL");
    setDateMode("TODAY");
    setFromDate("");
    setToDate("");
  };

  const handleUpdateStatus = async (newStatus) => {
    const target = statusTarget;
    setProcessingId(target.providerOrderId);
    try {
      await updateOrderStatus(providerId, target.providerOrderId, newStatus);
      toast.success("Order status updated successfully..!");
      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update order status. Please try again.");
      throw err;
    } finally {
      setProcessingId(null);
    }
  };

  // --- Column config for the generic <DataTable /> ---
  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (order) => <div className="hb-table__name">#{order.providerOrderId}</div>,
    },
    {
      key: "receiver",
      header: "Receiver",
      render: (order) => (
        <>
          <div className="hb-table__name">{order.receiverName}</div>
          <div className="hb-table__desc">{order.receiverContactNo}</div>
        </>
      ),
    },
    {
      key: "address",
      header: "Delivery Address",
      render: (order) => <div className="hb-table__desc">{order.deliveryAddress}</div>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (order) => `₹ ${order.vendorSubtotal}`,
    },
    // {
    //   key: "payment",
    //   header: "Payment",
    //   render: (order) => {
    //     const meta = getStatusMeta(PAYMENT_STATUS_META, order.paymentStatus);
    //     return (
    //       <>
    //         {order.paymentMethod}{" - "}
    //         {meta && (
    //           <StatusBadge label={meta.label} variant={meta.variant} />
    //         )}
    //       </>
    //     );
    //   },
    // },
    {
      key: "status",
      header: "Order Status",
      render: (order) => {
        const meta = getStatusMeta(ORDER_STATUS_META, order.fulfillmentStatus);
        return <StatusBadge label={meta.label} variant={meta.variant} />;
      },
    },
    {
      key: "createdAt",
      header: "Placed At",
      render: (order) => {
        const date = order.createdAt ? new Date(order.createdAt) : null;
        return date ? (
          <>
            <div>{date.toLocaleDateString()}</div>
            <div className="hb-table__desc">{date.toLocaleTimeString()}</div>
          </>
        ) : (
          "—"
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (order) => (
        <div className="hb-table__actions">
          <TableActionButton
            variant="neutral"
            icon={FaEye}
            iconOnly
            label="View Items"
            onClick={() => setViewTarget(order)}
          />
          <TableActionButton
            variant="update"
            icon={FaEdit}
            iconOnly
            label="Update Status"
            onClick={() => setStatusTarget(order)}
            disabled={processingId === order.providerOrderId}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="hb-orders hb-list-page">
      <PageHeader title="Orders" />

      {error && <ErrorState message={error} onRetry={fetchOrders} />}

      <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: "Search by receiver name..." }}
        filters={[
          {
            key: "orderStatus",
            value: orderStatusFilter,
            onChange: setOrderStatusFilter,
            allLabel: "All Order Status",
            options: ORDER_STATUS_OPTIONS.map((status) => ({
              label: getStatusMeta(ORDER_STATUS_META, status).label,
              value: status,
            })),
          },
          {
            key: "paymentStatus",
            value: paymentStatusFilter,
            onChange: setPaymentStatusFilter,
            allLabel: "All Payment Status",
            options: PAYMENT_STATUS_OPTIONS.map((status) => ({
              label: getStatusMeta(PAYMENT_STATUS_META, status).label,
              value: status,
            })),
          },
        ]}
        onReset={handleResetFilters}
      >
        <DateFilter
          mode={dateMode}
          onModeChange={setDateMode}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      </FiltersBar>

      <DataTable
        columns={columns}
        data={orders}
        rowKey={(order) => order.providerOrderId}
        emptyMessage="No orders match your search/filters."
        isLoading={loading}
        loadingMessage="Loading orders..."
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <OrderItemsModal
        isOpen={!!viewTarget}
        providerId={providerId}
        providerOrderId={viewTarget?.providerOrderId}
        onClose={() => setViewTarget(null)}
      />

      <UpdateOrderStatusModal
        isOpen={!!statusTarget}
        order={statusTarget}
        onSave={handleUpdateStatus}
        onClose={() => setStatusTarget(null)}
      />
    </div>
  );
}

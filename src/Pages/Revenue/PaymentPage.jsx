// src/pages/Orders/OrdersPage.jsx
//
// Table-based Orders page, built from the same reusable pieces as Menu
// Items / Tiffin Plans (src/components/tables/ + src/components/common/).
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
import FiltersBar from "../../components/tables/FiltersBar";
import DateFilter from "../../components/tables/DateFilter";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/tables/StatusBadge";
import TableActionButton from "../../components/tables/TableActionButton";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import PaymentItemsModal from "./PaymentItemsModal";
import {
    ORDER_STATUS_OPTIONS,
    ORDER_STATUS_META,
    PAYMENT_STATUS_OPTIONS,
    PAYMENT_STATUS_META,
    getStatusMeta,
    PAYMENT_METHOD_OPTIONS,
    PAYMENT_METHOD_META,
} from "../../utils/config";
import "./Payments.css";
import { useUserInfo } from "../../Context/UserContext";
import { getProviderOrders, updateOrderStatus } from "../../Services/orderService";
import { getProviderPayments, updatePaymentStatus } from "../../Services/paymentService";
import UpdatePaymentStatusModal from "./UpdatePaymentStatusModal";

const PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 500;

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function PaymentPage() {
    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();
    const providerId = user?.userId;

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [processingId, setProcessingId] = useState(null);

    const [search, setSearch] = useState("");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("ALL");
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

    const fetchPayments = useCallback(() => {
        if (!providerId) return Promise.resolve();

        const filters = {
            search: search.trim() === "" ? null : search.trim(),
            paymentMethod: paymentMethodFilter === "ALL" ? null : paymentMethodFilter,
            paymentStatus: paymentStatusFilter === "ALL" ? null : paymentStatusFilter,
            startDate: dateMode === "ALL" ? null : fromDate || null,
            endDate: dateMode === "RANGE" ? toDate || null : null,
        };

        setLoading(true);
        setError(null);

        // 👇 Extend getProviderOrders in OrderService.js to accept page/size and
        // pass them through as query params, alongside the OrderFilterDto fields.
        return getProviderPayments(filters, page, PAGE_SIZE)
            .then((response) => {
                setPayments(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            })
            .catch((err) => {
                console.error(err);
                setError("Couldn't load your payments. Please check your connection and try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [providerId, paymentMethodFilter, paymentStatusFilter, search, dateMode, fromDate, toDate, page]);

    useEffect(() => {
        setPage(0);
    }, [paymentMethodFilter, paymentStatusFilter, search, dateMode, fromDate, toDate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPayments();
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [fetchPayments]);

    // "Reset" clears every filter, including the date — unlike the initial
    // page load, an explicit reset means "show me everything," not "today."
    const handleResetFilters = () => {
        setSearch("");
        setPaymentMethodFilter("ALL");
        setPaymentStatusFilter("ALL");
        setDateMode("TODAY");
        setFromDate(todayIso());
        setToDate(todayIso());
    };

    const handleUpdateStatus = async (newStatus) => {
        // console.log(newStatus)
        const target = statusTarget;
        setProcessingId(target.paymentId);

        try {
            await updatePaymentStatus(target.paymentId, newStatus);
            toast.success("Payment status updated successfully..!");
            await fetchPayments();
        } catch (err) {
            console.error(err);
            toast.error("Couldn't update payment status. Please try again.");
            throw err;
        } finally {
            setProcessingId(null);
        }
    };

    // --- Column config for the generic <DataTable /> ---
    const columns = [
        {
            key: "id",
            header: "Transaction ID",
            render: (order) => <div className="hb-table__name">{order.transactionId}</div>,
        },
        {
            key: "customerName",
            header: "Customer Name",
            render: (order) => (
                <>
                    <div className="hb-table__name">{order.customerName}</div>
                    {/* <div className="hb-table__desc">{order.receiverContactNo}</div> */}
                </>
            ),
        },
        {
            key: "paymentType",
            header: "Type",
            render: (order) => <div className="hb-table__desc">{order.paymentType}</div>,
        },
        {
            key: "amount",
            header: "Amount",
            render: (order) => `${order.amount ? "₹ " + order.amount : "—"}`,
        },
        {
            key: "RefundedAmount",
            header: "Refunded Amount",
            render: (order) => `${order.refundedAmount ? "₹ " + order.refundedAmount : "—"}`,
        },
        {
            key: "PaymentMethod",
            header: "Method",
            render: (order) => `${order.paymentMethod ? order.paymentMethod : "—"}`,
        },
        {
            key: "PaymentStatus",
            header: "Status",
            render: (order) => {
                const meta = getStatusMeta(PAYMENT_STATUS_META, order.paymentStatus);
                return <StatusBadge label={meta.label} variant={meta.variant} />;
            },
        },
        {
            key: "PaidAt",
            header: "Paid At",
            render: (order) => {
                const date = order.paidAt ? new Date(order.paidAt) : null;
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
                    {/* <TableActionButton
                        variant="neutral"
                        icon={FaEye}
                        iconOnly
                        label="View Items"
                        onClick={() => setViewTarget(order)}
                    /> */}

                    <TableActionButton
                        variant="update"
                        icon={FaEdit}
                        iconOnly
                        label="Update Status"
                        onClick={() => setStatusTarget(order)}
                        disabled={processingId === order.paymentId || order.paymentStatus !== "PENDING"}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="hb-orders hb-list-page">
            <PageHeader title="Payments" />

            {error && <ErrorState message={error} onRetry={fetchPayments} />}

            <FiltersBar
                search={{ value: search, onChange: setSearch, placeholder: "Search payments..." }}
                filters={[
                    {
                        key: "paymentMethod",
                        value: paymentMethodFilter,
                        onChange: setPaymentMethodFilter,
                        allLabel: "All Payment methods",
                        options: PAYMENT_METHOD_OPTIONS.map((status) => ({
                            label: getStatusMeta(PAYMENT_METHOD_META, status).label,
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
                data={payments}
                rowKey={(order) => order.paymentId}
                emptyMessage="No payments match your search/filters."
                isLoading={loading}
                loadingMessage="Loading payments..."
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
            />

            {/* <PaymentItemsModal
                isOpen={!!viewTarget}
                providerId={providerId}
                providerOrderId={viewTarget?.providerOrderId}
                onClose={() => setViewTarget(null)}
            /> */}

            <UpdatePaymentStatusModal
                isOpen={!!statusTarget}
                order={statusTarget}
                onSave={handleUpdateStatus}
                onClose={() => setStatusTarget(null)}
            />
        </div>
    );
}

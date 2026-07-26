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
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import FiltersBar from "../../../Components/tables/FiltersBar";
import DataTable from "../../../Components/tables/DataTable";
import StatusBadge from "../../../Components/tables/StatusBadge";
import TableActionButton from "../../../Components/tables/TableActionButton";
import ErrorState from "../../../Components/common/ErrorState";
import PageHeader from "../../../Components/common/PageHeader";
import "./Deliveries.css";
import { useUserInfo } from "../../../Context/UserContext";
import { getTodaysDeliveries, updateDeliveryStatus } from "../../../Services/dailyDeliveriesService";
import UpdateDeliveryStatusModal from "./UpdateDeliveryStatusModal";
import { MENU_TYPE_OPTIONS, DELIVERY_STATUS_META, DELIVERY_STATUS_OPTIONS, getStatusMeta } from "../../../utils/config";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../../../utils/constants";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function DailyDeliveriesPage() {
    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();
    const providerId = user?.userId;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [processingId, setProcessingId] = useState(null);

    const [search, setSearch] = useState("");
    const [mealStatusFilter, setMealStatusFilter] = useState("ALL");
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("ALL");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [viewTarget, setViewTarget] = useState(null); // order to show items for
    const [statusTarget, setStatusTarget] = useState(null); // order to update status for

    const fetchDeliveries = useCallback(() => {
        if (!providerId) return Promise.resolve();

        const filters = {
            mealType: mealStatusFilter === "ALL" ? null : mealStatusFilter,
            status: deliveryStatusFilter === "ALL" ? null : deliveryStatusFilter,
            search: search.trim() === "" ? null : search.trim(),
        };

        setLoading(true);
        setError(null);

        // 👇 Extend getProviderOrders in OrderService.js to accept page/size and
        // pass them through as query params, alongside the OrderFilterDto fields.
        return getTodaysDeliveries(filters, page, PAGE_SIZE)
            .then((response) => {
                setOrders(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            })
            .catch((err) => {
                console.error(err);
                setError("Couldn't load your daily deliveries. Please check your connection and try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [providerId, mealStatusFilter, deliveryStatusFilter, search, page]);

    useEffect(() => {
        setPage(0);
    }, [mealStatusFilter, deliveryStatusFilter, search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDeliveries();
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [fetchDeliveries]);

    // "Reset" clears every filter, including the date — unlike the initial
    // page load, an explicit reset means "show me everything," not "today."
    const handleResetFilters = () => {
        setSearch("");
        setMealStatusFilter("ALL");
        setDeliveryStatusFilter("ALL")
    };

    const handleUpdateStatus = async (newStatus) => {
        const target = statusTarget;
        setProcessingId(target.deliveryId);
        try {
            await updateDeliveryStatus(target.deliveryId, newStatus);
            toast.success("delivery status updated successfully..!");
            await fetchDeliveries();
        } catch (err) {
            console.error(err);
            toast.error("Couldn't update delivery status. Please try again.");
            throw err;
        } finally {
            setProcessingId(null);
        }
    };

    // --- Column config for the generic <DataTable /> ---
    const columns = [
        {
            key: "id",
            header: "Delivery ID",
            render: (delivery) => <div className="hb-table__name">#{delivery.deliveryId}</div>,
        },
        {
            key: "receiver",
            header: "Receiver",
            render: (delivery) => (
                <>
                    <div className="hb-table__name">{delivery.receiverName}</div>
                    <div className="hb-table__desc">{"+91" + delivery.receiverContactNo}</div>
                </>
            ),
        },
        {
            key: "address",
            header: "Delivery Address",
            render: (delivery) => <div className="hb-table__desc">{delivery.deliveryAddress}</div>,
        },
        {
            key: "foodItems",
            header: "Meal",
            render: (delivery) => `${delivery.foodItems}`,
        },
        {
            key: "mealType",
            header: "Meal Type",
            render: (delivery) => `${delivery.mealType}`,
        },
        {
            key: "status",
            header: "Status",
            render: (delivery) => {
                const meta = getStatusMeta(DELIVERY_STATUS_META, delivery.status);
                return <StatusBadge label={meta.label} variant={meta.variant} />;
            },
        },
        {
            key: "actions",
            header: "Actions",
            render: (delivery) => (
                <div className="hb-table__actions">
                    <TableActionButton
                        variant="update"
                        icon={FaEdit}
                        iconOnly
                        label="Update Status"
                        onClick={() => setStatusTarget(delivery)}
                        disabled={processingId === delivery.deliveryId}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="hb-orders hb-list-page">
            <PageHeader title="Daily Deliveries" />

            {error && <ErrorState message={error} onRetry={fetchDeliveries} />}

            <FiltersBar
                search={{ value: search, onChange: setSearch, placeholder: "Search by user name..." }}
                filters={[
                    {
                        key: "mealTypes",
                        value: mealStatusFilter,
                        onChange: setMealStatusFilter,
                        allLabel: "All Types",
                        options: MENU_TYPE_OPTIONS.map((status) => ({
                            label: status,
                            value: status,
                        })),
                    },
                    {
                        key: "deliveryStatus",
                        value: deliveryStatusFilter,
                        onChange: setDeliveryStatusFilter,
                        allLabel: "All Status",
                        options: DELIVERY_STATUS_OPTIONS.map((status) => ({
                            label: getStatusMeta(DELIVERY_STATUS_META, status).label,
                            value: status,
                        })),
                    }
                ]}
                onReset={handleResetFilters}
            >
            </FiltersBar>

            <DataTable
                columns={columns}
                data={orders}
                rowKey={(delivery) => delivery.deliveryId}
                emptyMessage="No delivery match your search/filters."
                isLoading={loading}
                loadingMessage="Loading deliveries..."
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
            />

            <UpdateDeliveryStatusModal
                isOpen={!!statusTarget}
                delivery={statusTarget}
                onSave={handleUpdateStatus}
                onClose={() => setStatusTarget(null)}
            />
        </div>
    );
}

import React, { useEffect, useState } from 'react'
import DashboardStats from '../../Components/DashboardStats';
import { getOrderCount, getTiffinProviderOrdersInaRange } from '../../Services/OrderService';
import { getSubscriptionCount } from '../../Services/SubscriptionService';
import { useUserInfo } from '../../Context/UserContext';
import { getTotalRevenueOfProvider } from '../../Services/PaymentService';
import ScreenLoader from '../../Components/ScreenLoader';
import { useOrderData } from '../../Context/OrderContext';

export const Dashboard = () => {

    const COLORS = ["#0088FE", "#FFBB28"];

    const { getDashboardOrders, setDashboardOrders } = useOrderData();

    const [loading, setLoading] = useState(true);

    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();

    const [ordersData, setOrdersData] = useState({});
    const [subscriptionCount, setSubscriptionCount] = useState("");
    const [orderCount, setOrderCount] = useState("");
    const [totalRevenue, setTotalRevenue] = useState("");

    useEffect(() => {
        getSubscriptions();
        getOrders();
        getTotalRevenue();
        getAllOrders();
    }, []);

    const getAllOrders = () => {
        if(getDashboardOrders() == null) {
            const { monday, sunday } = getCurrentWeekRange();
            getTiffinProviderOrdersInaRange(user.userId, monday, sunday).then((response) => {
                console.log("inside dashboard")
                const formattedData = formatOrdersData(response);
                setOrdersData(formattedData);
                setDashboardOrders(formattedData);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.error('Error fetching orders:', error)
            });
        } else {
            setLoading(false);
            setOrdersData(getDashboardOrders());
            console.log("Localsotrage");
        }
    }

    const getCurrentWeekRange = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

        const monday = new Date(today);
        // If today is Sunday (0), go back 6 days, else go back (dayOfWeek - 1)
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return {
            monday: monday.toISOString().slice(0, 10),
            sunday: sunday.toISOString().slice(0, 10)
        };
    };

    const formatOrdersData = (orders) => {
        const dayMap = {
            Mon: 0,
            Tue: 0,
            Wed: 0,
            Thu: 0,
            Fri: 0,
            Sat: 0,
            Sun: 0,
        };

        orders.forEach(order => {
            const day = new Date(order.orderDate).toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue", etc
            if (dayMap[day] !== undefined) {
                dayMap[day]++;
            }
        });

        return Object.keys(dayMap).map(day => ({
            day: day,
            orders: dayMap[day]
        }));
    };

    const getSubscriptions = () => {
        setLoading(true);
        getSubscriptionCount(user.userId).then((response) => {
            setSubscriptionCount(response);
            console.log("subscription count", response)
        })
    }

    const getOrders = () => {
        getOrderCount(user.userId).then((response) => {
            console.log(response);
            setOrderCount(response);
        })
    }

    const getTotalRevenue = () => {
        getTotalRevenueOfProvider(user.userId).then((response) => {
            setTotalRevenue(response)
        }).catch((error) => {
            console.log(error);
        })
    }


    const subscriptionData = [
        { name: "Subscribed", value: Number(subscriptionCount) },
        { name: "Non-Subscribed", value: Number(orderCount) },
    ];


    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h1 className="text-3xl mb-2 heading">Dashboard</h1>
                    <DashboardStats firstBox={orderCount} firstBoxTitle="Total Orders"
                        secondBox={totalRevenue} secondBoxTitle="Revenue"
                        thirdBox={subscriptionCount} thirdBoxTitle="Active subscriptions"
                        lineChartData={ordersData} lineChartTite="Orders Over the Week" xaxisDataKey={"day"} lineDataKey={"orders"}
                        pieChartData={subscriptionData} PieChartTitle="subscription status" COLORS={COLORS} />
                </>)}
        </div>
    );
}
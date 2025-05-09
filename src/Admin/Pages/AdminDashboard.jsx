import React, { useEffect, useState } from 'react'
import DashboardStats from '../../Components/DashboardStats';
import { getAllOrderCount, getOrdersInaRange } from '../../Services/OrderService';
import { getAllSubscriptionCount } from '../../Services/SubscriptionService';
import { getAllUserByRole, getAllUserCount, getAllUserCountByRole } from '../../Services/UserService';
import ScreenLoader from '../../Components/ScreenLoader';
import { getTotalRevenue } from '../../Services/PaymentService';
import { useOrderData } from '../../Context/OrderContext';

export const AdminDashboard = () => {
    const COLORS = ["#0088FE", "#FFBB28"];

    const [loading, setLoading] = useState(true);

    const { getDashboardOrders, setDashboardOrders } = useOrderData();

    const [ordersData, setOrdersData] = useState({});
    const [allUserCount, setAllUserCount] = useState("");
    const [userCount, setUserCount] = useState("");
    const [providerCount, setProviderCount] = useState("");
    const [orderCount, setOrderCount] = useState("");
    const [totalRevenue, setTotalRevenue] = useState("");

    const getAllOrders = () => {

        if (getDashboardOrders() == null) {
            const { monday, sunday } = getCurrentWeekRange();
            
            getOrdersInaRange(monday, sunday).then((response) => {
                setLoading(false);
                const formattedData = formatOrdersData(response);
                setOrdersData(formattedData);
                setDashboardOrders(formattedData);
            }).catch((error) => {
                setLoading(false);
                console.error('Error fetching orders:', error)
            });
        } else {
            setLoading(false);
            setOrdersData(getDashboardOrders());
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

    const getAllUsers = () => {
        setLoading(true);
        getAllUserCount().then((response) => {
            setAllUserCount(response);
        })

        getAllUserCountByRole("ROLE_NORMAL_USER").then((response) => {
            setUserCount(response);
        })

        getAllUserCountByRole("ROLE_TIFFIN_PROVIDER").then((response) => {
            setProviderCount(response);
        })
    }

    const getOrders = () => {
        getAllOrderCount().then((response) => {
            console.log(response);
            setOrderCount(response);
        }).catch((error) => {
            console.log(error)
        })
    }

    const getRevenue = () => {
        getTotalRevenue().then((response) => {
            setTotalRevenue(response)
        }).catch((error) => {
            console.log(error);
        })
    }

    const loadData = () => {
        // setLoading(true);
        getAllUsers();
        getOrders();
        getRevenue();
        getAllOrders();
        // setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    const subscriptionData = [
        { name: "Normal User", value: Number(userCount) },
        { name: "Tiffin Provider", value: Number(providerCount) },
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
                        thirdBox={allUserCount} thirdBoxTitle="Total users"
                        lineChartData={ordersData} lineChartTite="Orders Over the Week" xaxisDataKey={"day"} lineDataKey={"orders"}
                        pieChartData={subscriptionData} PieChartTitle="Users" COLORS={COLORS}
                    />
                </>)}
        </div>
    );
}

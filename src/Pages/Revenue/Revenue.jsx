import React, { useEffect, useState } from 'react'
import DashboardStats from '../../Components/DashboardStats';
import { useUserInfo } from '../../Context/UserContext';
import { getPastPaymentData, getTotalMenuItemRevenue, getTotalRevenueOfProvider, getTotalSUbRevenue } from '../../Services/PaymentService';
import dayjs from 'dayjs';
import ScreenLoader from '../../Components/ScreenLoader';
import { useOrderData } from '../../Context/OrderContext';

export const Revenue = () => {
    const COLORS = ["#0088FE", "#00C49F"];

    const [loading, setLoading] = useState(false);

    const { getRevenueOfOrders, setRevenueOfOrders } = useOrderData();

    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();

    const [totalRevenue, setTotalRevenue] = useState(Number);
    const [subRevenue, setSubRevenue] = useState(Number);
    const [OneTimePayments, setOneTimePayments] = useState(Number);

    const [revenueData, setRevenueData] = useState([]);

    const calculateDate = () => {
        const today = new Date();
        const sixMonthsAgo = new Date(today); // create a copy
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        sixMonthsAgo.setDate(1); // force to 1st of that month

        console.log(sixMonthsAgo.toISOString().slice(0, 10)); // "2024-11-01"

        return sixMonthsAgo.toISOString().slice(0, 10);
    }

    const TotalRevenueOfProvider = () => {
        setLoading(true);
        getTotalRevenueOfProvider(user.userId).then((response) => {
            setTotalRevenue(response)
            console.log("Total revenue", response)
        })
    }

    const TotalSubscriptionRevenue = () => {
        getTotalSUbRevenue(user.userId).then((response) => {
            console.log(response);
            setSubRevenue(response);
        })
    }

    const TotalMenuItemRevenue = () => {
        getTotalMenuItemRevenue(user.userId).then((response) => {
            console.log(response);
            setOneTimePayments(response);
        })
    }

    const formatData = (data) => {

        // Step 1: Create a map for lookup
        const dataMap = new Map(
            data.map(([year, month, amount]) => [`${year}-${month}`, amount])
        );

        // Step 2: Generate the last 6 months
        const now = dayjs();
        const last6Months = [];

        for (let i = 5; i >= 0; i--) {
            const date = now.subtract(i, 'month');
            const year = date.year();
            const month = date.month() + 1; // 0-indexed in dayjs
            const key = `${year}-${month}`;
            const amount = dataMap.get(key) || 0;

            last6Months.push({
                month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(year, month - 1)),
                revenue: amount,
            });
        }

        return last6Months;
    }


    const PastPaymentData = () => {
        if (getRevenueOfOrders() == null) {
            const date = calculateDate();
            getPastPaymentData(user.userId, date).then((response) => {
                setLoading(false);
                const data = response;

                // Transform the raw [year, month, amount] to objects
                const formatted = formatData(data);

                setRevenueData(formatted);
                setRevenueOfOrders(formatted);
                console.log("Past data", formatted)
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        } else {
            setLoading(false);
            setRevenueData(getRevenueOfOrders());
            console.log("Localstorage");
        }
    }


    useEffect(() => {
        TotalRevenueOfProvider();
        TotalSubscriptionRevenue();
        TotalMenuItemRevenue();
        PastPaymentData();
    }, [])

    const revenueBreakdown = [
        { name: "Subscription", value: subRevenue },
        { name: "One-Time Orders", value: OneTimePayments },
    ];

    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h1 className="text-3xl mb-2 heading">Revenue</h1>
                    <DashboardStats firstBox={"₹" + totalRevenue} firstBoxTitle={"Total Revenue"}
                        secondBox={subRevenue} secondBoxTitle={"Subscription Revenue"}
                        thirdBox={"₹" + OneTimePayments} thirdBoxTitle={"One time-order Revenue"}
                        lineChartData={revenueData} lineChartTite={"Revenue Over Time"} xaxisDataKey={"month"} lineDataKey={"revenue"}
                        pieChartData={revenueBreakdown} PieChartTitle={"Revenue Breakdown"}
                        COLORS={COLORS}
                    />
                </>)}
        </div>
    )
}

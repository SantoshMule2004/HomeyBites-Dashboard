import React, { useEffect, useState } from 'react'
import { getMenuItemRevenue, getPastPayment, getSUbRevenue, getTotalRevenue } from '../../Services/PaymentService';
import DashboardStats from '../../Components/DashboardStats'
import ScreenLoader from '../../Components/ScreenLoader';
import dayjs from 'dayjs';
import { useOrderData } from '../../Context/OrderContext';

export const AdminRevenue = () => {
    const COLORS = ["#0088FE", "#00C49F"];

    const [loading, setLoading] = useState(true);

    const { getRevenueOfOrders, setRevenueOfOrders } = useOrderData();

    const [totalRevenue, setTotalRevenue] = useState(Number);
    const [subRevenue, setSubRevenue] = useState(Number);
    const [OneTimePayments, setOneTimePayments] = useState(Number);

    const [revenueData, setRevenueData] = useState([]);

    const calculateDate = () => {
        const today = new Date();
        const sixMonthsAgo = new Date(today); // create a copy
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        sixMonthsAgo.setDate(1); // force to 1st of that month
        return sixMonthsAgo.toISOString().slice(0, 10);
    }

    const TotalRevenue = () => {
        setLoading(true);
        getTotalRevenue().then((response) => {
            setTotalRevenue(response)
            console.log("Total revenue", response)
        })
    }

    const TotalSubscriptionRevenue = () => {
        getSUbRevenue().then((response) => {
            setSubRevenue(response);
        })
    }

    const TotalMenuItemRevenue = () => {
        getMenuItemRevenue().then((response) => {
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
        if(getRevenueOfOrders() == null) {
            const date = calculateDate();
            getPastPayment(date).then((response) => {
                setLoading(false);
                const data = response;
                
                const formatted = formatData(data);
                
                setRevenueData(formatted);
                setRevenueOfOrders(formatted);
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        } else {
            setLoading(false);
            setRevenueData(getRevenueOfOrders());
        }
    }

    const loadData = () => {
        TotalRevenue();
        TotalSubscriptionRevenue();
        TotalMenuItemRevenue();
        PastPaymentData();
    }

    useEffect(() => {
        loadData();
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
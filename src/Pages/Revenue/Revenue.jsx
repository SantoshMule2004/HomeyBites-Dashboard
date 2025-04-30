import React, { useState } from 'react'
import DashboardStats from '../../Components/DashboardStats';

export const Revenue = () => {
    const COLORS = ["#0088FE", "#00C49F"];

    const [totalRevenue, setTotalRevenue] = useState(15000);
    const [subRevenue, setSubRevenue] = useState(6000);
    const [pendingpayments, setPendingpayments] = useState(2000);

    const revenueData = [
        { month: "Jan", revenue: 4000 },
        { month: "Feb", revenue: 5000 },
        { month: "Mar", revenue: 7000 },
        { month: "Apr", revenue: 6500 },
        { month: "May", revenue: 8000 },
        { month: "Jun", revenue: 9000 },
    ];

    const revenueBreakdown = [
        { name: "Subscription", value: 6000 },
        { name: "One-Time Orders", value: 3000 },
    ];

    return (
        <div className="container mt-5 p-2">
            <h1 className="text-3xl mb-2 heading">Revenue</h1>
            <DashboardStats firstBox={"₹" + totalRevenue} firstBoxTitle={"Total Revenue"}
                secondBox={subRevenue} secondBoxTitle={"Subscription Revenue"}
                thirdBox={"₹" + pendingpayments} thirdBoxTitle={"Pending Payments"}
                lineChartData={revenueData} lineChartTite={"Revenue Over Time"} xaxisDataKey={"month"} lineDataKey={"revenue"}
                pieChartData={revenueBreakdown} PieChartTitle={"Revenue Breakdown"}
                COLORS={COLORS}
            />
        </div>
    )
}

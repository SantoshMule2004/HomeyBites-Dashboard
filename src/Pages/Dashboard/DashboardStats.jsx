import React, { useState } from 'react';
import '../../Components/Style.css'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, CartesianGrid, Line } from 'recharts';

const ordersData = [
    { day: "Mon", orders: 30 },
    { day: "Tue", orders: 45 },
    { day: "Wed", orders: 50 },
    { day: "Thu", orders: 35 },
    { day: "Fri", orders: 60 },
    { day: "Sat", orders: 75 },
    { day: "Sun", orders: 80 },
];

const subscriptionData = [
    { name: "Subscribed", value: 120 },
    { name: "Non-Subscribed", value: 80 },
];

const COLORS = ["#0088FE", "#FFBB28"];

const DashboardStats = () => {
    const [totalOrders] = useState(450);
    const [revenue] = useState(25000);
    const [subscriptions] = useState(120);
    
    return (
        <div className="container-fluid p-4">
            <div className="row">
                <div className="col-md-4 mb-2">
                    <div className="card p-3 text-center shadow">
                        <h5>Total Orders</h5>
                        <h3>350</h3>
                    </div>
                </div>
                <div className="col-md-4 mb-2">
                    <div className="card p-3 text-center shadow">
                        <h5>Total Revenue</h5>
                        <h3>₹4500</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 text-center shadow">
                        <h5>Active Subscriptions</h5>
                        <h3>120</h3>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card p-3 shadow">
                        <h5>Orders Over the Week</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={ordersData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-md-6 mt-4">
                    <div className="card p-3 shadow">
                        <h5>Subscription Status</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={subscriptionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                    {subscriptionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const RevenueStats = () => {
  // Sample data (Replace with API data)
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

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 text-center shadow">
            <h5>Total Revenue</h5>
            <h3>₹15,000</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow">
            <h5>Subscription Revenue</h5>
            <h3>₹6,000</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow">
            <h5>Pending Payments</h5>
            <h3>₹2,000</h3>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3 shadow">
            <h5>Revenue Over Time</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow">
            <h5>Revenue Breakdown</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={revenueBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {revenueBreakdown.map((entry, index) => (
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

export default RevenueStats;

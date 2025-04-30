import React, { useState } from 'react';
import './Style.css'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, CartesianGrid, Line } from 'recharts';

const DashboardStats = ({ firstBox, firstBoxTitle, secondBox, secondBoxTitle, thirdBox, thirdBoxTitle, lineChartData, xaxisDataKey, lineDataKey, lineChartTite, pieChartData, PieChartTitle, COLORS }) => {
    return (
        <div className="container-fluid p-4">
            <div className="row">
                <div className="col-md-4 mb-2">
                    <div className="card p-3 text-center shadow">
                        <h5>{firstBoxTitle}</h5>
                        <h3>{firstBox}</h3>
                    </div>
                </div>
                <div className="col-md-4 mb-2">
                    <div className="card p-3 text-center shadow">
                        <h5>{secondBoxTitle}</h5>
                        <h3>₹{secondBox}</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 text-center shadow">
                        <h5>{thirdBoxTitle}</h5>
                        <h3>{thirdBox}</h3>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card p-3 shadow">
                        <h5>{lineChartTite}</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={xaxisDataKey} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey={lineDataKey} stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-md-6 mt-4">
                    <div className="card p-3 shadow">
                        <h5>{PieChartTitle}</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    verticalAlign="top"
                                    align='center'
                                    height={36}
                                    iconType="square"
                                    layout="vertical"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;

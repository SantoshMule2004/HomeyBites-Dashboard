import React from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, CartesianGrid, Line } from 'recharts';

const DashboardStats = ({ firstBox, firstBoxTitle, secondBox, secondBoxTitle, thirdBox, thirdBoxTitle, lineChartData, xaxisDataKey, lineDataKey, lineChartTite, pieChartData, PieChartTitle, COLORS }) => {
    return (
        <div className="container-fluid hb-stats">
            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="hb-card hb-stat-card">
                        <h5 className="hb-stat-card__title">{firstBoxTitle}</h5>
                        <h3 className="hb-stat-card__value">{firstBox}</h3>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="hb-card hb-stat-card">
                        <h5 className="hb-stat-card__title">{secondBoxTitle}</h5>
                        <h3 className="hb-stat-card__value">₹{secondBox}</h3>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="hb-card hb-stat-card">
                        <h5 className="hb-stat-card__title">{thirdBoxTitle}</h5>
                        <h3 className="hb-stat-card__value">{thirdBox}</h3>
                    </div>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-md-6 mb-3">
                    <div className="hb-card hb-chart-card">
                        <h5 className="hb-chart-card__title">{lineChartTite}</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={xaxisDataKey} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey={lineDataKey} stroke="var(--hb-accent, #ff7a1a)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="hb-card hb-chart-card">
                        <h5 className="hb-chart-card__title">{PieChartTitle}</h5>
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
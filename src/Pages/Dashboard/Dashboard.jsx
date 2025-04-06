import React, { useEffect, useState } from 'react'
import DashboardStats from './DashboardStats';
import { Base } from '../Base/Base';

export const Dashboard = () => {
    return (
        <div className="container mt-5 p-2">
            <h1 className="text-3xl mb-2 heading">Dashboard</h1>
            <DashboardStats />
        </div>
    );
}

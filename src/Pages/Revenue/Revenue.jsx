import React from 'react'
import { Base } from '../Base/Base'
import RevenueStats from './RevenueStats'

export const Revenue = () => {
    return (
        <div className="container mt-5 p-2">
            <h1 className="text-3xl mb-2 heading">Revenue</h1>
            <RevenueStats />
        </div>
    )
}

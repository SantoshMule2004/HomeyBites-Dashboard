import React from 'react'
import { Base } from '../Base/Base'
import { Link } from 'react-router-dom'

export const TodayOrder = () => {
    const userData = [
        {
            "id": 1,
            "Email": "user1@gmail.com",
            "address": "abc ",
            "oDate": "25/03/25",
            "Price": "50",
            "status": [
                "Pending",
                "Completed",
                "On the way"
            ]
        },
        {
            "id": 2,
            "Email": "user1@gmail.com",
            "address": "abc ",
            "oDate": "25/03/25",
            "Price": "50",
            "status": [
                "Pending",
                "Completed",
                "On the way"
            ]
        },
        {
            "id": 3,
            "Email": "user1@gmail.com",
            "address": "abc ",
            "oDate": "25/03/25",
            "Price": "50",
            "status": [
                "Pending",
                "Completed",
                "On the way"
            ]
        },
        {
            "id": 4,
            "Email": "user1@gmail.com",
            "address": "abc ",
            "oDate": "25/03/25",
            "Price": "50",
            "status": [
                "Pending",
                "Completed",
                "On the way"
            ]
        },
        {
            "id": 5,
            "Email": "user1@gmail.com",
            "address": "abc ",
            "oDate": "25/03/25",
            "Price": "50",
            "status": [
                "Pending",
                "Completed",
                "On the way"
            ]
        }
    ]

    return (
        <div className='container mt-5 p-2'>
            <h2 className="text-3xl mb-4 heading">Today`s Orders</h2>
            <div className="table-responsive">
                <table className="table">
                    <thead className="table-dark" style={{ height: '60px' }}>
                        <tr>
                            <th className='align-middle' scope="col">Order Id</th>
                            <th className='align-middle' scope="col">Email Id</th>
                            <th className='align-middle' scope="col">Order address</th>
                            <th className='align-middle' scope="col">Order date</th>
                            <th className='align-middle' scope="col">Price</th>
                            <th className='align-middle' scope="col">Order status</th>
                            <th className='align-middle' scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user) => (
                            <tr key={user.id}>
                                <td scope='row'>{user.id}</td>
                                <td>{user.Email}</td>
                                <td>{user.address}</td>
                                <td>{user.oDate}</td>
                                <td>{user.Price}</td>
                                <td>
                                    <select className="form-select">
                                        {user.status.map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td><Link to='#' className='btn fw-bold text-secondary'>View Info</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

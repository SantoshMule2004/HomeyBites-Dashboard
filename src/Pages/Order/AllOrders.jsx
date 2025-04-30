import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { Link, useNavigate } from 'react-router-dom'
import { getAllOrders, getAllOrdersOfProvider } from '../../Services/OrderService'
import ScreenLoader from '../../Components/ScreenLoader'
import { useUserInfo } from '../../Context/UserContext';

export const AllOrders = () => {

    const [orderData, setOrderData] = useState({});

    const isAdmin = localStorage.getItem("AdminLogin");

    const {getUserInfo} = useUserInfo();
    const user = getUserInfo();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [emailIds, setEmailIds] = useState({});

    const getAllOrder = () => {
        setLoading(true);
        if (isAdmin) {
            getAllOrders().then((response) => {
                console.log("success", response);
                setOrderData(response)
                localStorage.setItem("totalOrders", response.length);

                const OrderInfo = response;
                const map = {};
                OrderInfo.forEach(order => {
                    if (typeof order.user === 'object' && order.user !== null && 'userId' in order.user) {
                        console.log("inside order")
                        map[order.user.userId] = order?.user?.emailId; // Stores unique email ids
                    }
                });

                setEmailIds(map);
                setLoading(false);

            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        } else {
            if (user != null) {
                getAllOrdersOfProvider(user.userId, "Completed").then((response) => {
                    setLoading(false);
                    console.log("uccess", response);
                    setOrderData(response)
                    localStorage.setItem("totalOrders", response.length);

                    const OrderInfo = response;
                    const map = {};
                    OrderInfo.forEach(order => {
                        if (typeof order.user === 'object' && order.user !== null && 'userId' in order.user) {
                            console.log("inside order")
                            map[order.user.userId] = order?.user?.emailId; // Stores unique email ids
                        }
                    });

                    setEmailIds(map);

                }).catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
            }
        }
    }

    useEffect(() => {
        getAllOrder();
    }, [])

    return (
        <div className='container mt-5 p-2'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <div className='d-flex align-items-start justify-content-between'>
                        <h2 className="text-3xl mb-4 heading">All Orders</h2>

                        <div className="dropdown me-4">
                            <button className="nav-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{ borderRadius: '25px', backgroundColor: '#fff', padding: '5px 10px' }}>
                                <i className="fas fa-filter"></i> Filter
                            </button>
                            <ul className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownMenuButton1">
                                <li><Link to='#' className='dropdown-item custom-item' >By order status</Link></li>
                                <li><Link to='#' className='dropdown-item custom-item'>By tiffin provider</Link></li>
                                <li><Link to='#' className='dropdown-item custom-item'>Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                    {orderData.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <p className="fs-6">Currently no <strong>Order’s</strong> available.</p>
                        </div>
                    ) : (
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
                                    {orderData.map((order) => (
                                        <tr key={order.orderId}>
                                            <td scope='row'>{order.orderId}</td>
                                            <td>{order.user.emailId || emailIds?.[order?.user]}</td>
                                            <td>{order.orderAddress}</td>
                                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                                            <td>{order.price}</td>
                                            <td className={`fw-bold ${order.orderStatus === "Completed" ? 'text-success' : 'text-warning'}`}>{order.orderStatus}</td>
                                            <td><Link to='#' className='btn fw-bold text-secondary'>View Info</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>)}
        </div>
    )
}

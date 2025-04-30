import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllTodaysOrders, getTodaysOrders, updateOrderStatus } from '../../Services/OrderService'
import ScreenLoader from '../../Components/ScreenLoader'
import { toast } from 'react-toastify'
import { useUserInfo } from '../../Context/UserContext';

export const TodayOrder = () => {
    const [orderData, setOrderData] = useState({});

    const isAdmin = localStorage.getItem("AdminLogin");

    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const getTodayOrder = () => {
        setLoading(true);

        if (isAdmin) {
            getAllTodaysOrders().then((response) => {
                setLoading(false);
                console.log("uccess", response);
                setOrderData(response)
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        } else {
            if (user != null) {
                getTodaysOrders(user.userId).then((response) => {
                    setLoading(false);
                    console.log("uccess", response);
                    setOrderData(response)
                }).catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
            }
        }
    }

    const [status, setStatus] = useState("");

    useEffect(() => {
        getTodayOrder();
    }, [])

    const changeHandler = (e) => {
        setStatus(e.target.value)
    }

    useEffect(() => {
        console.log(status)
    }, [status])

    const updateStatus = (orderId) => {

        updateOrderStatus(orderId, status).then((response) => {
            console.log(response)
            toast.success("Order status updated successfully..!")
            getTodayOrder();
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className='container mt-5 p-2'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-4 heading">Today’s Orders</h2>
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
                                        {
                                            status && (
                                                <th className='align-middle' scope="col"></th>
                                            )
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.map((order) => (
                                        <tr key={order.orderId}>
                                            <td scope='row'>{order.orderId}</td>
                                            <td>{order.user.emailId}</td>
                                            <td>{order.orderAddress}</td>
                                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                                            <td>{order.price}</td>
                                            <td>
                                                <select className="form-select" value={status || order.orderStatus} onChange={changeHandler}>
                                                    <option value="Placed">Placed</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="On the way">On the Way</option>
                                                </select>
                                            </td>
                                            {
                                                status && (
                                                    <td><button onClick={() => updateStatus(order.orderId)} className='btn fw-bold text-secondary'>update</button></td>
                                                )
                                            }
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

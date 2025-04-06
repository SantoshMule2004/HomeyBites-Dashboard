import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { Link, useNavigate } from 'react-router-dom'
import { getUserInfo } from '../../Components/Auth/Index';
import { fetchSubscriptions } from '../../Services/SubscriptionService';
import ScreenLoader from '../../Components/ScreenLoader';

export const Subscription = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const user = getUserInfo();

    const [subscriptionData, setsubscriptionData] = useState([]);

    const getSubscriptionsOfTiffinProvider = () => {
        setLoading(true);
        if (user != null) {
            fetchSubscriptions(user.userId).then((response) => {
                setLoading(false);
                setsubscriptionData(response);
                console.log(response)
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
    }

    useEffect(() => {
        getSubscriptionsOfTiffinProvider();
    }, [])

    return (
        <div className='container mt-5 p-2'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-4 heading">User Subscriptions</h2>
                    {subscriptionData.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            {/* <p className="fs-5">You don’t have any Subscriber’s</p> */}
                            <p className="fs-6">You don’t have any <strong>Subscriber’s</strong>.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table">
                                <thead className="table-dark" style={{ height: '60px' }}>
                                    <tr>
                                        <th className='align-middle' scope="col">user name</th>
                                        <th className='align-middle' scope="col">Email Id</th>
                                        <th className='align-middle' scope="col">Start date</th>
                                        <th className='align-middle' scope="col">End date</th>
                                        <th className='align-middle' scope="col">Plan validity</th>
                                        <th className='align-middle' scope="col">Plan Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptionData.map((sub) => (
                                        <tr key={sub?.user.userId}>
                                            <td>{sub?.user.firstName + " " + sub?.user.lastName}</td>
                                            <td>{sub?.user.emailId}</td>
                                            <td>{sub.startDate}</td>
                                            <td>{sub.endDate}</td>
                                            <td>{sub.planDuration}</td>
                                            <td><Link to='/view-user-subscription' onClick={() => localStorage.setItem("subId", sub.planId)} className='btn fw-bold' style={{ color: '#ff6600', border: 'none' }}>View</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

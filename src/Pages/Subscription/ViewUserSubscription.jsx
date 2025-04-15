import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { Link, useLocation } from 'react-router-dom';
import { fetchSubscriptionOfUser } from '../../Services/SubscriptionService';
import ScreenLoader from '../../Components/ScreenLoader';

export const ViewUserSubscription = () => {

    const location = useLocation();

    const planId = localStorage.getItem("subId");
    console.log("sub id(view plan)", planId);

    const [loading, setLoading] = useState(true);

    const [subscriptionData, setsubscriptionData] = useState([]);
    const [userData, setuserData] = useState([]);
    const [tiffinData, setTiffinData] = useState([]);

    const [menuData, setMenuData] = useState({});

    const getSubscriptionInfo = () => {
        setLoading(true);
        if (planId != null) {
            fetchSubscriptionOfUser(planId).then((response) => {
                setLoading(false);
                setsubscriptionData(response);
                setuserData(response?.user);

                if (response?.tiffinPlan) {
                    console.log("tiffin plan", response?.tiffinPlan)
                    setTiffinData(response?.tiffinPlan);
                } else {
                    console.log("tiffin log", response?.tiffinPlanLog)
                    setTiffinData(response?.tiffinPlanLog);
                }

                const tiffinInfo = response?.tiffinPlan ? response?.tiffinPlan : response?.tiffinPlanLog;
                const map = {};
                tiffinInfo.tiffinDays.forEach(day => {
                    day.menuItem.forEach(item => {
                        if (typeof item === 'object' && item !== null && 'menuId' in item) {
                            map[item.menuId] = item; // Stores unique menuId → object
                        }
                    });
                });

                setMenuData(map);

                console.log("subscription data", response);
                console.log("User data", response?.user);
                console.log("tiffin data", response?.tiffinPlan);
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
    }

    useEffect(() => {
        getSubscriptionInfo();
    }, [])


    return (
        <div className='container mt-5 p-3' >
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h1 className="text-3xl mb-3 heading">User Subscription</h1>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="inputUserName" className="form-label fw-bold">User name</label>
                            <input type="text" className="form-control no-focus-outline" id="inputUserName" value={userData.firstName + " " + userData.lastName} readOnly />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputUserEmail" className="form-label fw-bold">Email Id</label>
                            <input type="text" className="form-control no-focus-outline" id="inputUserEmail" value={userData.emailId} readOnly />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputSDate" className="form-label fw-bold">Start Date</label>
                            <input type="text" className="form-control no-focus-outline" id="inputSDate" value={subscriptionData.startDate} readOnly />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputEDate" className="form-label fw-bold">End Date</label>
                            <input type="text" className="form-control no-focus-outline" id="inputEDate" value={subscriptionData.endDate} readOnly />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputPlanDuration" className="form-label fw-bold">Plan validity</label>
                            <input type="text" className="form-control no-focus-outline" id="inputPlanDuration" value={subscriptionData.planDuration} readOnly />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPlanName" className="form-label fw-bold">Plan Name</label>
                            <input type="text" className="form-control no-focus-outline" id="inputPlanName" value={tiffinData.planName} readOnly />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPlanType" className="form-label fw-bold">Plan Type</label>
                            <input type="text" className="form-control no-focus-outline" id="inputPlanType" value={tiffinData.planType} readOnly />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputMenuPrice" className="form-label fw-bold">Price</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text">₹</span>
                                <input type="text" className="form-control no-focus-outline" id='inputMenuPrice' aria-label="Amount (to the nearest dollar)" value={tiffinData.price} readOnly />
                                <span className="input-group-text">.00</span>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <label htmlFor="inputAddons" className="form-label fw-bold">Add Ons</label>
                            <input type="text" className="form-control no-focus-outline" id="inputAddons" value={tiffinData.addOns} readOnly />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label fw-bold">Selected Days:</label>
                            <label className={`form-label ${subscriptionData.monday ? "" : "d-none"}`} >Monday,</label>
                            <label className={`form-label ${subscriptionData.tuesday ? "" : "d-none"}`} style={{ paddingLeft: '10px' }}>Tuesday,</label>
                            <label className={`form-label ${subscriptionData.wednesday ? "" : "d-none"}`} style={{ paddingLeft: '10px' }}>Wednesday,</label>
                            <label className={`form-label ${subscriptionData.thursday ? "" : "d-none"}`} style={{ paddingLeft: '10px' }}>Thurday,</label>
                            <label className={`form-label ${subscriptionData.friday ? "" : "d-none"}`} style={{ paddingLeft: '10px' }}>Friday,</label>
                            <label className={`form-label ${subscriptionData.saturday ? "" : "d-none"}`} style={{ paddingLeft: '10px' }}>Saturday,</label>
                            <label className={`form-label ${subscriptionData.sunday ? "" : "d-none"}`} style={{ paddingLeft: '10px' }}>Sunday</label>
                        </div>
                    </div>

                    <div className="table-responsive mt-5">
                        <table className="table">
                            <thead className="table-dark" style={{ height: '60px' }}>
                                <tr>
                                    <th className='align-middle' scope="col"></th>
                                    <th className='align-middle' scope="col">Breakfast</th>
                                    <th className='align-middle' scope="col">Lunch</th>
                                    <th className='align-middle' scope="col">Dinner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tiffinData?.tiffinDays.map((day, index) => (
                                    <tr key={index}>
                                        <td className='fw-bold'>{day?.weekDay || '-'}</td>
                                        <td>{day?.menuItem?.[0]?.menuName || menuData[day?.menuItem?.[0]]?.menuName}</td>
                                        <td>{day?.menuItem?.[1]?.menuName || menuData[day?.menuItem?.[1]]?.menuName}</td>
                                        <td>{day?.menuItem?.[2]?.menuName || menuData[day?.menuItem?.[2]]?.menuName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

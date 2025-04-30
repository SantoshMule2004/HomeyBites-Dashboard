import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../../Components/ScreenLoader';
import { getTiffinPlan } from '../../../Services/TiffinPlanService';

export const ViewSingleTiffinPlan = () => {

    const [loading, setLoading] = useState(true);
    const planId = localStorage.getItem("planId");
    console.log("plan id", planId)
    const [tiffinData, setTiffinData] = useState([]);
    const [menuData, setMenuData] = useState({});

    const getTiffinData = () => {
        setLoading(true);
        if (planId != null) {
            getTiffinPlan(planId).then((response) => {
                setLoading(false);
                setTiffinData(response);
                console.log("updated plan data", response)

                const tiffinInfo = response;
                const map = {};
                tiffinInfo.tiffinDays.forEach(day => {
                    day.menuItem.forEach(item => {
                        if (typeof item === 'object' && item !== null && 'menuId' in item) {
                            map[item.menuId] = item; // Stores unique menuId → object
                        }
                    });
                });

                setMenuData(map);

                console.log(response)
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            })
        }
    }

    useEffect(() => {
        getTiffinData();
    }, [planId])

    return (
        <div>
            <div className='container mt-5 p-3' >
                {loading ? (
                    <ScreenLoader />
                ) : (
                    <>
                        <h1 className="text-3xl mb-3 heading">Tiffin Plan</h1>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="inputPlanName" className="form-label fw-bold">Plan Name</label>
                                <input type="text" className="form-control no-focus-outline" id="inputPlanName" value={tiffinData.planName || ""} readOnly />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputPlanType" className="form-label fw-bold">Plan Type</label>
                                <input type="text" className="form-control no-focus-outline" id="inputPlanType" value={tiffinData.planType || ""} readOnly />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="inputMenuPrice" className="form-label fw-bold">Price</label>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">₹</span>
                                    <input type="text" className="form-control no-focus-outline" id='inputMenuPrice' aria-label="Amount (to the nearest dollar)" value={tiffinData.price || ""} readOnly />
                                    <span className="input-group-text">.00</span>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <label htmlFor="inputAddons" className="form-label fw-bold">Add Ons</label>
                                <input type="text" className="form-control no-focus-outline" id="inputAddons" value={tiffinData.addOns || ""} readOnly />
                            </div>
                        </div>

                        <div className="table-responsive mt-3 hide-scrollbar">
                            <table className="table">
                                <thead className="table-dark" style={{ height: '60px' }}>
                                    <tr>
                                        <th className='align-middle' scope="col">Week Day</th>
                                        <th className='align-middle' scope="col">Breakfast</th>
                                        <th className='align-middle' scope="col">Lunch</th>
                                        <th className='align-middle' scope="col">Dinner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tiffinData?.tiffinDays || []).map((plan, index) => (
                                        <tr key={index}>
                                            <td className="fw-bold">{plan?.weekDay || "-"}</td>
                                            {["0", "1", "2"].map((mealType, i) => (
                                                <td key={i}>
                                                    {
                                                        plan?.menuItem?.[mealType]?.menuName || menuData[plan?.menuItem?.[mealType]]?.menuName
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}

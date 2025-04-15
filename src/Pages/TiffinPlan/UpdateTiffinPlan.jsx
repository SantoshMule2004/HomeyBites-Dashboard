import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../Components/Auth/Index';
import { getMenuOfProvider } from '../../Services/MenuService';
import useButtonLoader from '../../Components/UseButtonLoader';
import { updateTiffinPlan } from '../../Services/TiffinPlanService';
import { toast } from 'react-toastify';
import { useTiffinPlans } from '../../Context/TiffinPlanContext';

export const UpdateTiffinPlan = () => {

    const [loading, setLoading] = useState(false);
    const [TiffinPlanText, setButtonLoading] = useButtonLoader(
        "Update",
        "Update"
    )
    const { updateTiffinPlanData } = useTiffinPlans();

    const user = getUserInfo();

    const navigate = useNavigate();
    const planData = JSON.parse(localStorage.getItem("tiffinData")) || [];
    console.log("plan data", planData);

    const [tiffinData, setTiffinData] = useState({
        tiffinPlanId: planData.tiffinPlanId,
        planName: planData.planName,
        planType: planData.planType,
        price: planData.price,
        addOns: planData.addOns,
        tiffinDays: planData.tiffinDays,
        active: planData.active
    });

    const [formData, setFormData] = useState({
        planName: planData.planName,
        planType: planData.planType,
        price: planData.price,
        addOns: planData.addOns,
        tiffinDays: planData.tiffinDays,
        active: planData.active
    });

    useEffect(() => {
        console.log("formdata", formData)
        console.log("tiffin data", tiffinData)
    }, [])

    // localStorage.removeItem("tiffinData");

    const [breakFastData, setbreakFastData] = useState([]);
    const [ThaliData, setThaliData] = useState([]);

    const getMenuItems = () => {
        setLoading(true);
        if (user != null) {
            getMenuOfProvider(user.userId).then((response) => {
                setLoading(false);
                setbreakFastData(response.filter((item) => item.menuType === "Breakfast"));
                setThaliData(response.filter((item) => item.menuType === "Thali"));
                console.log(response)

            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
    }

    useEffect(() => {
        getMenuItems();
    }, [])

    // function to update input fields
    const handleInputChange = (e, property) => {
        setFormData({ ...formData, [property]: e.target.value });
    };

    // Function to update menuIds for a specific weekday
    const handleMenuChange = (dayIndex, mealIndex, menuId) => {
        setFormData(prevState => {
            const updatedTiffinDays = [...prevState.tiffinDays];

            // Ensure tiffinDays[dayIndex] exists
            if (!updatedTiffinDays[dayIndex]) {
                updatedTiffinDays[dayIndex] = { weekDay: "", menuIds: ["", "", ""] };
            }

            // Ensure menuIds exists and is an array before modifying
            if (!Array.isArray(updatedTiffinDays[dayIndex].menuIds)) {
                updatedTiffinDays[dayIndex].menuIds = ["", "", ""];
            }

            // Update the selected meal
            updatedTiffinDays[dayIndex].menuIds[mealIndex] = menuId;

            return { ...prevState, tiffinDays: updatedTiffinDays };
        });

    };

    const HandleUpdateTiffinPlan = (event) => {
        event.preventDefault();
        setButtonLoading(true);

        updateTiffinPlan(tiffinData.tiffinPlanId, formData).then((response) => {
            setButtonLoading(false);
            toast.success("Tiffin plan Updated successfully..!");
            updateTiffinPlanData(tiffinData.tiffinPlanId, response?.classObj);
            navigate("/tiffinplan")

        }).catch((error) => {
            setButtonLoading(false);
            toast.error(error)
        })
    }

    return (
        <div className='container mt-5 p-3' >
            <h1 className="text-3xl mb-3 heading">Update Tiffin Plan</h1>
            <form>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="inputPlanName" className="form-label fw-bold">Plan Name</label>
                        <input type="text" className="form-control no-focus-outline" id="inputPlanName" value={formData.planName || ""} onChange={(e) => handleInputChange(e, 'planName')} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputPlanType" className="form-label fw-bold">Plan Type</label>
                        {/* <input type="text" className="form-control" id="inputPlanType" value={formData.planType || ""} onChange={(e) => handleInputChange(e, 'planType')} /> */}
                        <select id="inputPlanType" className="form-select no-focus-outline" value={formData.planType} onChange={(e) => handleInputChange(e, 'planType')}>
                            <option value={formData.planType}>{formData.planType}</option>
                            <option value='Veg'>Veg</option>
                            <option value='Non-veg'>Non-Veg</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Jain">Jain</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputMenuPrice" className="form-label fw-bold">Price</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text">₹</span>
                            <input type="text" className="form-control no-focus-outline" id='inputMenuPrice' aria-label="Amount (to the nearest dollar)" value={formData.price || ""} onChange={(e) => handleInputChange(e, 'price')} />
                            <span className="input-group-text">.00</span>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <label htmlFor="inputAddons" className="form-label fw-bold">Add Ons</label>
                        <input type="text" className="form-control no-focus-outline" id="inputAddons" value={formData.addOns || ""} onChange={(e) => handleInputChange(e, 'addOns')} />
                    </div>
                </div>

                {/* <div className="table-responsive mt-5">
                        <table className="table">
                            <thead className="table-dark" style={{ height: '60px' }}>
                                <tr>
                                    <th className='align-middle' scope="col"></th>
                                    <th className='align-middle' scope="col">Breakfast</th>
                                    <th className='align-middle' scope="col">Lunch</th>
                                    <th className='align-middle' scope="col">Dinner</th>
                                    <th className='align-middle' scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(formData?.tiffinDays || []).map((plan, dayIndex) => (
                                    <tr key={dayIndex}>
                                        <td className='fw-bold'>{plan?.weekDay || '-'}</td>
                                        {["Breakfast", "Lunch", "Dinner"].map((meal, mealIndex) => (
                                            <td key={mealIndex}>
                                                <select
                                                    value={plan?.menuIds?.[mealIndex] || ""}
                                                    onChange={(e) => handleMenuChange(dayIndex, mealIndex, e.target.value)}
                                                    style={{ marginLeft: '5px' }}
                                                >
                                                    <option value="">{`Select ${meal.toLowerCase()}`}</option>
                                                    {(meal === "Breakfast" ? breakFastData : ThaliData).map((item) => (
                                                        <option key={item.menuId} value={item.menuId}>{item.menuName}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        ))}
                                        <td><button className='btn button'>Update</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> */}



                {/* <div className="table-responsive mt-5">
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
                                        <td className='fw-bold'>{plan?.weekDay || '-'}</td>
                                        <td>{plan?.menuItem?.[2]?.menuName || '-'}</td>
                                        <td>{plan?.menuItem?.[1]?.menuName || '-'}</td>
                                        <td>{plan?.menuItem?.[0]?.menuName || '-'}</td>
                                    
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> */}

                <div className="col-12 mt-3 d-flex justify-content-center">
                    <button type="submit" className="btn button m-2" onClick={HandleUpdateTiffinPlan}>{TiffinPlanText}</button>
                </div>
            </form>
        </div>
    )
}

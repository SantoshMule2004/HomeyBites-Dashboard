import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { getUserInfo } from '../../Components/Auth/Index';
import { getMenuOfProvider } from '../../Services/MenuService';
import useButtonLoader from '../../Components/UseButtonLoader';
import { toast } from 'react-toastify';
import { addTiffinPlan } from '../../Services/TiffinPlanService';
import ScreenLoader from '../../Components/ScreenLoader';
import { useNavigate } from 'react-router-dom';

export const AddTiffinPlan = () => {
    const [loading, setLoading] = useState(false);
    const [TiffinPlanText, setTiffinButtonLoading] = useButtonLoader(
        "Add Tiffinplan",
        ""
    )

    const navigate = useNavigate();

    const [tiffinData, setTiffinData] = useState({
        planName: '',
        planType: '',
        price: '',
        addOns: '',
        tiffinDays: [
            { weekDay: "Monday", menuIds: ["", "", ""] },
            { weekDay: "Tuesday", menuIds: ["", "", ""] },
            { weekDay: "Wednesday", menuIds: ["", "", ""] },
            { weekDay: "Thursday", menuIds: ["", "", ""] },
            { weekDay: "Friday", menuIds: ["", "", ""] },
            { weekDay: "Saturday", menuIds: ["", "", ""] },
            { weekDay: "Sunday", menuIds: ["", "", ""] }
        ],
        active: true
    });

    const user = getUserInfo();
    const [menuItems, setMenuItems] = useState([]);
    const [breakFastData, setbreakFastData] = useState([]);
    const [ThaliData, setThaliData] = useState([]);

    // get menuitems to be shown
    const getMenuItems = () => {
        setLoading(true);
        if (user != null) {
            getMenuOfProvider(user.userId).then((response) => {
                setLoading(false);
                setMenuItems(response);

                setbreakFastData(response.filter((item) => item.menuType === "Breakfast"));
                setThaliData(response.filter((item) => item.menuType === "Thali"));

                console.log(response)
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
    }

    const addTiffinPlanHandler = (event) => {
        event.preventDefault();
        setTiffinButtonLoading(true);
        // setLoading(true);

        if (!tiffinData.planName && !tiffinData.planType && !tiffinData.price && !tiffinData.addOns && !tiffinData.tiffinDays) {
            toast.error("");
            setTiffinButtonLoading(false);
            // setLoading(false);
            return;
        }

        if (user != null) {
            addTiffinPlan(user.userId, tiffinData).then((response) => {
                setTiffinButtonLoading(false);
                console.log("sent tiffin data", tiffinData)
                console.log("response", response)
                // setLoading(false);
                toast.success("Tiffin plan added successfully..!");
                navigate("/tiffinplan");
            }).catch((error) => {
                setTiffinButtonLoading(false);
                // setLoading(false);
                console.log(error);
                toast.error(error);
            })
        }
    }

    useEffect(() => {
        getMenuItems();
    }, [])

    useEffect(() => {
        console.log("TiffinData", tiffinData);
    })

    // function to update input fields
    const handleInputChange = (e, property) => {
        setTiffinData({ ...tiffinData, [property]: e.target.value });
    };

    // Function to update menuIds for a specific weekday
    const handleMenuChange = (dayIndex, mealIndex, menuId) => {
        const updatedTiffinDays = [...tiffinData.tiffinDays];
        updatedTiffinDays[dayIndex].menuIds[mealIndex] = menuId;
        setTiffinData({ ...tiffinData, tiffinDays: updatedTiffinDays });
    };

    return (
        <div className="container mt-5 p-3" style={{ backgroundColor: '#faf9f6' }}>
            {/* {loading ? (
                    <ScreenLoader />
                ) : ( 
                    <>*/}
            <h2 className="text-3xl mb-5 heading">Add Tiffin Plans</h2>
            <form className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="inputPlanName" className="form-label fw-bold">Plan Name</label>
                    <input type="text" className="form-control" id="inputPlanName" value={tiffinData.planName} onChange={(e) => handleInputChange(e, 'planName')} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPlanType" className="form-label fw-bold">Plan Type</label>
                    <select id="inputPlanType" className="form-select" value={tiffinData.planType} onChange={(e) => handleInputChange(e, 'planType')}>
                        <option value="">Select plan type</option>
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
                        <input type="text" className="form-control" id='inputMenuPrice' aria-label="Amount (to the nearest dollar)" value={tiffinData.price} onChange={(e) => handleInputChange(e, 'price')} />
                        <span className="input-group-text">.00</span>
                    </div>
                </div>
                <div className="col-md-8">
                    <label htmlFor="inputAddons" className="form-label fw-bold">Add Ons</label>
                    <input type="text" className="form-control" id="inputAddons" value={tiffinData.addOns} onChange={(e) => handleInputChange(e, 'addOns')} />
                </div>

                <h3>Select Menu for Each Day</h3>
                {tiffinData.tiffinDays.map((dayPlan, dayIndex) => (
                    <div key={dayIndex} style={{
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        padding: "20px"
                    }}>
                        <h4>{dayPlan.weekDay}</h4>

                        {/* FLEX ROW LAYOUT FOR MENU ITEMS */}
                        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>

                            {/* Breakfast Dropdown */}
                            <div>
                                <label>Breakfast:</label>
                                <select
                                    value={dayPlan.menuIds[0]}
                                    onChange={(e) => handleMenuChange(dayIndex, 0, e.target.value)}
                                    style={{ marginLeft: '5px' }}
                                >
                                    <option value="">Select</option>
                                    {breakFastData.map((item) => (
                                        <option key={item.menuId} value={item.menuId}>{item.menuName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Lunch Dropdown */}
                            <div>
                                <label>Lunch:</label>
                                <select
                                    value={dayPlan.menuIds[1]}
                                    onChange={(e) => handleMenuChange(dayIndex, 1, e.target.value)}
                                    style={{ marginLeft: '5px' }}
                                >
                                    <option value="">Select</option>
                                    {ThaliData.map((item) => (
                                        <option key={item.menuId} value={item.menuId}>{item.menuName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dinner Dropdown */}
                            <div>
                                <label>Dinner:</label>
                                <select
                                    value={dayPlan.menuIds[2]}
                                    onChange={(e) => handleMenuChange(dayIndex, 2, e.target.value)}
                                    style={{ marginLeft: '5px' }}
                                >
                                    <option value="">Select</option>
                                    {ThaliData.map((item, index) => (
                                        <option key={index} value={item.menuId}>{item.menuName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-12 mt-5 d-flex justify-content-center">
                    <button type="submit" className="btn button" style={{ width: '25%' }} onClick={addTiffinPlanHandler}>{TiffinPlanText}</button>
                </div>
            </form>
            {/* </>
                )} */}
        </div>
    )
}

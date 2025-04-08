import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useButtonLoader from '../../Components/UseButtonLoader';
import { deleteTiffinPlan, getTiffinPlan, updateMneuItemInTiffinPlan } from '../../Services/TiffinPlanService';
import ConfirmModal from '../../Components/ConfirmModel';
import ScreenLoader from '../../Components/ScreenLoader';
import { toast } from 'react-toastify';
import { getMenuOfProvider } from '../../Services/MenuService';
import { getUserInfo } from '../../Components/Auth/Index';

export const ViewTiffinPlan = () => {

    const [loading, setLoading] = useState(false);
    const [tiffinPlanText, setTiffinPlanButtonLoading] = useButtonLoader(
        "Delete",
        ""
    )

    const [saveText, setSaveLoading] = useButtonLoader(
        "Save",
        ""
    )
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingIndex, setEditingIndex] = useState(null);

    const [selectedMenu, setSelectedMenu] = useState({})

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

    const navigate = useNavigate();
    const location = useLocation();

    const planId = localStorage.getItem("planId");
    console.log("plan id", planId)
    const [tiffinData, setTiffinData] = useState([]);

    const getTiffinData = () => {
        setLoading(true);
        setTiffinPlanButtonLoading(true);
        if (planId != null) {
            getTiffinPlan(planId).then((response) => {
                setLoading(false);
                setTiffinPlanButtonLoading(false);
                setTiffinData(response);
                console.log(response)
                localStorage.setItem("tiffinData", JSON.stringify(response));
            }).catch((error) => {
                console.log(error);
                setLoading(false);
                setTiffinPlanButtonLoading(false);
            })
        }
    }
    // const [tiffinData, settiffinData] = useState(tiffinData);

    const deleteTiffinPlanHandler = () => {
        setLoading(true);
        setTiffinPlanButtonLoading(true);
        deleteTiffinPlan(planId).then((response) => {
            navigate('/tiffinplan');
            setLoading(false);
            setTiffinPlanButtonLoading(false);
            console.log(response);
            toast.success("Tiffinplan deleted successfulluy..!");
        }).catch((error) => {
            setLoading(false);
            setTiffinPlanButtonLoading(false);
            console.log(error);
        })
    }

    useEffect(() => {
        getTiffinData();
        getMenuItems();
    }, [])

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        setIsModalOpen(false);
        deleteTiffinPlanHandler();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const handleUpdateClick = (index) => {
        setEditingIndex(index); // Enable editing for this row
        const currentMenuIds = tiffinData.tiffinDays[index].menuItem.map(item => item.menuId);
        setSelectedMenu({ [index]: { ...currentMenuIds } });
    };

    const handleSelectChange = (e, index, mealType) => {
        const newMenuId = e.target.value;
        setSelectedMenu((prev) => ({
            ...prev,
            [index]: { ...prev[index], [mealType]: newMenuId },
        }));
    };

    console.log("selected data", selectedMenu)

    const handleSave = (index) => {
        setSaveLoading(true);
        const oldIds = tiffinData.tiffinDays[index].menuItem.map(item => item.menuId);
        const newIds = [selectedMenu[index][0], selectedMenu[index][1], selectedMenu[index][2]];

        const payload = {
            oldIds,
            newIds
        };

        console.log("Sending to backend:", payload);

        // api call to update menuitem in tiffin plan
        updateMneuItemInTiffinPlan(planId, tiffinData.tiffinDays[index].weekDay, payload).then((response) => {
            setSaveLoading(false);
            toast.success("menuitem Updated successfully..!");
            localStorage.setItem("planId", response?.classObj?.tiffinPlanId);
            console.log(response);
            navigate("/view-tiffinplan")
            setEditingIndex(null);
        }).catch((error) => {
            setSaveLoading(false);
            console.log(error)
        })
    }

    return (
        <>
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

                        <div className="table-responsive mt-3">
                            <table className="table">
                                <thead className="table-dark" style={{ height: '60px' }}>
                                    <tr>
                                        <th className='align-middle' scope="col">Week Day</th>
                                        <th className='align-middle' scope="col">Breakfast</th>
                                        <th className='align-middle' scope="col">Lunch</th>
                                        <th className='align-middle' scope="col">Dinner</th>
                                        <th className='align-middle' scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tiffinData?.tiffinDays || []).map((plan, index) => (
                                        // <tr key={index}>
                                        //     <td className='fw-bold'>{plan?.weekDay || '-'}</td>
                                        //     <td>{plan?.menuItem?.[2]?.menuName || '-'}</td>
                                        //     <td>{plan?.menuItem?.[1]?.menuName || '-'}</td>
                                        //     <td>{plan?.menuItem?.[0]?.menuName || '-'}</td>
                                        //     <td><Link to='' className='btn button'>Update</Link></td>
                                        // </tr>

                                        <tr key={index}>
                                            <td className="fw-bold">{plan?.weekDay || "-"}</td>
                                            {["0", "1", "2"].map((mealType, i) => (
                                                <td key={i}>
                                                    {editingIndex === index ? (
                                                        <select
                                                            className="form-select no-focus-outline"
                                                            value={selectedMenu[index]?.[mealType] || plan?.menuItem?.[mealType]?.menuId}
                                                            onChange={(e) => handleSelectChange(e, index, mealType)}
                                                        >
                                                            {menuItems.map((menu) => (
                                                                <option key={menu.menuId} value={menu.menuId}>
                                                                    {menu.menuName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        plan?.menuItem?.[mealType]?.menuName || "-"
                                                    )}
                                                </td>
                                            ))}
                                            <td>
                                                {editingIndex === index ? (
                                                    <button className="btn button" style={{width:"100%"}} onClick={() => handleSave(index)}>
                                                        {saveText}
                                                    </button>
                                                ) : (
                                                    <button className="btn button" style={{width:"100%"}} onClick={() => handleUpdateClick(index)}>
                                                        Update
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="col-12 mt-3 d-flex justify-content-center" >
                            <button type="submit" className="btn button m-2" onClick={() => navigate("/update-tiffinplan")}>Update Plan Info</button>
                            <button type="submit" className="btn button m-2" onClick={handleDeleteClick}>{tiffinPlanText}</button>
                        </div>
                    </>
                )}
            </div>

            <ConfirmModal isOpen={isModalOpen} onConfirm={handleConfirm} onCancel={handleCancel} title="Confirm" content="Confirm, you want to delete this tiffin plan?" />
        </>
    )
}

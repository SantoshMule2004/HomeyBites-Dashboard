import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteMenu, getMenuOfProvider, updateMenu } from '../../Services/MenuService'
import '../../Components/Style.css'
import ScreenLoader from '../../Components/ScreenLoader'
import { useMenuItems } from '../../Context/MenuItemContext'
import useButtonLoader from '../../Components/UseButtonLoader'
import { toast } from 'react-toastify'
import ConfirmModal from '../../Components/ConfirmModel'
import { useUserInfo } from '../../Context/UserContext';

export const MenuItem = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [MenuItemText, setMenuItemButtonLoading] = useButtonLoader(
        "Update",
        ""
    )

    const { getUserInfo } = useUserInfo();

    const [DeleteMenuItemText, setDeleteMenuItemButtonLoading] = useButtonLoader(
        "Delete",
        ""
    )

    const user = getUserInfo();
    const [menuItems, setMenuItems] = useState([]);

    const [update, setUpdate] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const { getMenuItemsData, setMenuItemsData, updateMenuItemData, deleteMenuItemData } = useMenuItems();

    const getMenuItems = () => {
        setLoading(true);
        if (user != null) {
            if (getMenuItemsData() == null) {
                console.log("Making API call")
                getMenuOfProvider(user.userId).then((response) => {
                    setLoading(false);
                    setMenuItems(response);
                    setMenuItemsData(response);
                    console.log(response)
                }).catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
            } else {
                setLoading(false);
                console.log("Data from localstorage")
                setMenuItems(getMenuItemsData());
            }
        }
    }

    const menuData = JSON.parse(localStorage.getItem("menuData")) || [];

    localStorage.removeItem("menuData");

    const [updatedMenuData, setUpdatedMenuData] = useState({
        menuId: menuData.menuId,
        menuName: menuData.menuName,
        price: menuData.price,
        description: menuData.description,
        menuType: menuData.menuType,
        active: menuData.active,
        imageUrl: menuData.imageUrl
    })

    const changeHandler = (event, property) => {
        setUpdatedMenuData({ ...updatedMenuData, [property]: event.target.value })
    }

    const updateMenuItemHandler = (event) => {
        event.preventDefault();
        // setLoading(true);
        setMenuItemButtonLoading(true);

        updateMenu(updatedMenuData.menuId, updatedMenuData).then((response) => {
            // setLoading(false);
            setMenuItemButtonLoading(false);
            toast.success("Menuitem updated successfully..!")
            console.log(response);
            updateMenuItemData(updatedMenuData.menuId, response.classObj)
            setMenuItems(getMenuItemsData());
            setUpdate(null);
        }).catch((error) => {
            // setLoading(false);
            setMenuItemButtonLoading(false);
            console.log(error)
        })
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getMenuItems();
    }, [])

    const deleteMenuItem = () => {
        setMenuItemButtonLoading(true);
        deleteMenu(deleteId).then((response) => {
            setLoading(false);
            setDeleteMenuItemButtonLoading(false);
            console.log(response);
            deleteMenuItemData(deleteId);
            setMenuItems(getMenuItemsData());
            toast.success("MenuItem deleted successfulluy..!");
            setDeleteId(null);
        }).catch((error) => {
            setDeleteMenuItemButtonLoading(false);
            console.log(error);
        })
    }


    const handleDeleteClick = (menuId) => {
        setDeleteId(menuId);
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        setIsModalOpen(false);
        deleteMenuItem();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-3 heading">Menu Items</h2>
                    {menuItems.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <p className="fs-5">You don’t have any menu items.</p>
                            <p className="fs-6">Click on <strong>"Add New Item"</strong> to add your first menuitem.</p>
                        </div>
                    ) : (
                        <div className="row mx-3">
                            {menuItems.map((item) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={item.menuId}>
                                    <div className="card shadow-sm h-100">
                                        <img
                                            src={item.imageUrl}
                                            className="card-img-top"
                                            alt={item.menuName}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column p-3">

                                            {
                                                update === item.menuId && (
                                                    <>
                                                        <div className="col-md-12 mb-2">
                                                            {/* <label htmlFor="inputMenuName" className="form-label fw-bold">Menu item name</label> */}
                                                            <input type="text" className="form-control no-focus-outline" id="inputMenuName" onChange={(e) => changeHandler(e, 'menuName')} value={updatedMenuData.menuName} />
                                                        </div>

                                                        <div className="col-md-12 mb-2">
                                                            {/* <label htmlFor="inputDesc" className="form-label fw-bold">Description</label> */}
                                                            {/* <input type="text" className="form-control" id="inputDesc" /> */}
                                                            <textarea className="form-control no-focus-outline" rows="3" id='inputDesc' onChange={(e) => changeHandler(e, 'description')} value={updatedMenuData.description}></textarea>
                                                        </div>

                                                        <div className="col-md-12">
                                                            {/* <label htmlFor="inputMenuPrice" className="form-label fw-bold">Price</label> */}
                                                            <div className="input-group mb-3">
                                                                <span className="input-group-text">₹</span>
                                                                <input type="text" className="form-control no-focus-outline" id='inputMenuPrice' aria-label="Amount (to the nearest dollar)" onChange={(e) => changeHandler(e, 'price')} value={updatedMenuData.price} />
                                                                <span className="input-group-text">.00</span>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <button className="btn button" type='submit' style={{ width: '50%' }} onClick={updateMenuItemHandler}>{MenuItemText}</button>
                                                            {/* <button className={`submit ${loading ? "submit-clicked" : ""} `} type='submit' onClick={AddMenuItemHandler}></button> */}
                                                            <button className="btn button" style={{ width: '50%' }} onClick={() => setUpdate(null)}>cancel</button>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            {
                                                update !== item.menuId && (
                                                    <>
                                                        <h6 className="card-title">{item.menuName}</h6>
                                                        {/* onClick={()=> navigate("/view-menuitem",{ state: { menuId: item.menuId} })} style={{cursor:'pointer'}} */}
                                                        <p className="card-text small text-muted truncate-description">{item.description}</p>
                                                        <p className="fw-bold text-success mb-1">₹{item.price}</p>

                                                        {/* Bottom buttons container */}

                                                        <div className="d-flex justify-content-between mt-auto flex-wrap">
                                                            <a className="btn button w-100 w-sm-auto" onClick={() => {
                                                                setUpdate(item.menuId);
                                                                setUpdatedMenuData({ ...item });
                                                            }}>Update</a>
                                                            <a className="btn button m-1 w-100 w-sm-auto" onClick={() => handleDeleteClick(item.menuId)}>{DeleteMenuItemText}</a>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <ConfirmModal isOpen={isModalOpen} onConfirm={handleConfirm} onCancel={handleCancel} title="Confirm" content="Confirm, you want to delete this menuitem?" />

                    <Link to='/add-menuitem'>
                        <button className="btn button position-fixed bottom-0 end-0 m-4 shadow-lg"
                            style={{ borderRadius: "50px", padding: "12px 20px", fontSize: "16px" }}>
                            <i className="fa fa-plus me-2"></i> Add New Item
                        </button>
                    </Link>
                </>
            )}
        </div>
    )
}

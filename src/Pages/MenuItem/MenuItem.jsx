import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { Link, useNavigate } from 'react-router-dom'
import { getUserInfo } from '../../Components/Auth/Index'
import { getMenuOfProvider } from '../../Services/MenuService'
import '../../Components/Style.css'
import ScreenLoader from '../../Components/ScreenLoader'
import { useMenuItems } from '../../Context/MenuItemContext'

export const MenuItem = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const user = getUserInfo();
    const [menuItems, setMenuItems] = useState([]);

    const { getMenuItemsData, setMenuItemsData } = useMenuItems();

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

    useEffect(() => {
        getMenuItems();
    }, [])

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
                        <div className="row">
                            {menuItems.map((item) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={item.menuId}>
                                    <div className="card shadow-sm h-100" onClick={() => navigate("/view-menuitem", { state: { menuId: item.menuId } })}>
                                        <img
                                            src={item.imageUrl}
                                            className="card-img-top"
                                            alt={item.menuName}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column p-3">
                                            <h6 className="card-title">{item.menuName}</h6>
                                            {/* onClick={()=> navigate("/view-menuitem",{ state: { menuId: item.menuId} })} style={{cursor:'pointer'}} */}
                                            <p className="card-text small text-muted truncate-description">{item.description}</p>
                                            <p className="fw-bold text-success mb-1">₹{item.price}</p>

                                            {/* Bottom buttons container */}

                                            {/* <div className="d-flex justify-content-between mt-auto flex-wrap">
                                                <a className="btn button w-100 w-sm-auto" onClick={() => navigate("/view-menuitem", { state: { menuId: item.menuId } })}>View</a>
                                                {/* <a className="btn button m-1 w-100 w-sm-auto">Delete</a>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

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

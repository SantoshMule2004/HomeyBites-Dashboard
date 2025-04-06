import React, { useState } from 'react'
import { Base } from '../Base/Base'
import { useLocation, useNavigate } from 'react-router-dom';
import useButtonLoader from '../../Components/UseButtonLoader';
import { updateMenu } from '../../Services/MenuService';
import { toast } from 'react-toastify';

export const UpdateMenuItem = () => {

    const [loading, setLoading] = useState(false);
    const [MenuItemText, setMenuItemButtonLoading] = useButtonLoader(
        "Update",
        ""
    )

    const navigate = useNavigate();

    const location = useLocation();
    const menuData = JSON.parse(localStorage.getItem("menuData")) || [];

    localStorage.removeItem("menuData");

    const [updatedMenuData, setMenuData] = useState({
        menuId: menuData.menuId,
        menuName: menuData.menuName,
        price: menuData.price,
        description: menuData.description,
        menuType: menuData.menuType,
        active: menuData.active,
        imageUrl: menuData.imageUrl
    })

    const changeHandler = (event, property) => {
        setMenuData({ ...updatedMenuData, [property]: event.target.value })
    }

    const updateMenuItemHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        setMenuItemButtonLoading(true);

        updateMenu(updatedMenuData.menuId, updatedMenuData).then((response) => {
            setLoading(false);
            setMenuItemButtonLoading(false);
            toast.success("Menuitem updated successfully..!")
            navigate('/menuitem')
        }).catch((error) => {
            setLoading(false);
            setMenuItemButtonLoading(false);
            console.log(error)
        })
    }

    return (
        <div className="container mt-5 p-2 d-flex justify-content-center mt-4">
            <form>
                <div className="card shadow-sm p-3" style={{ maxWidth: "400px", borderRadius: "10px" }}>
                    {/* Image Section */}
                    <div className="text-center">
                        <img
                            src={updatedMenuData.imageUrl}
                            alt={updatedMenuData.menuName}
                            className="img-fluid rounded"
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                    </div>

                    {/* Item Details */}
                    <div className="card-body">
                        <div className="col-md-12">
                            <label htmlFor="inputMenuName" className="form-label fw-bold">Menu item name</label>
                            <input type="text" className="form-control" id="inputMenuName" onChange={(e) => changeHandler(e, 'menuName')} value={updatedMenuData.menuName} />
                        </div>

                        <div className="col-md-12">
                            <label htmlFor="inputDesc" className="form-label fw-bold">Description</label>
                            {/* <input type="text" className="form-control" id="inputDesc" /> */}
                            <textarea className="form-control" rows="3" id='inputDesc' onChange={(e) => changeHandler(e, 'description')} value={updatedMenuData.description}></textarea>
                        </div>

                        <div className="col-md-12">
                            <label htmlFor="inputMenuPrice" className="form-label fw-bold">Price</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text">₹</span>
                                <input type="text" className="form-control" id='inputMenuPrice' aria-label="Amount (to the nearest dollar)" onChange={(e) => changeHandler(e, 'price')} value={updatedMenuData.price} />
                                <span className="input-group-text">.00</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex justify-content-center gap-2">
                            <button className="btn button" style={{ width: '100%' }} type='submit' onClick={updateMenuItemHandler}>{MenuItemText}</button>
                            {/* <button className={`submit ${loading ? "submit-clicked" : ""} `} type='submit' onClick={AddMenuItemHandler}></button> */}
                            {/* <button className="btn btn-danger" style={{ width: '50%' }}>Delete</button> */}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

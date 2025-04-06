import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import Poha from '../../assets/Breakfast/Poha.jpg'
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteMenu, getMenu } from '../../Services/MenuService';
import ScreenLoader from '../../Components/ScreenLoader';
import ConfirmModal from '../../Components/ConfirmModel';
import { toast } from 'react-toastify';
import useButtonLoader from '../../Components/UseButtonLoader';

export const ViewMenuItem = () => {
    const [loading, setLoading] = useState(true);
    const [MenuItemText, setMenuItemButtonLoading] = useButtonLoader(
        "Delete",
        ""
    )

    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();
    const { menuId } = location.state || {};

    const [menuItem, setMenuItem] = useState([]);

    const getMenuItem = () => {
        setLoading(true);
        if (menuId != null) {
            getMenu(menuId).then((response) => {
                console.log(response);
                setMenuItem(response);
                localStorage.setItem("menuData", JSON.stringify(response));
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
    }

    const deleteMenuItem = () => {
        setLoading(true);
        setMenuItemButtonLoading(true);
        deleteMenu(menuId).then((response) => {
            setLoading(false);
            setMenuItemButtonLoading(false);
            console.log(response);
            navigate('/menuitem');
            toast.success("MenuItem deleted successfulluy..!");
        }).catch((error) => {
            setLoading(false);
            setMenuItemButtonLoading(false);
            console.log(error);
        })
    }

    useEffect(() => {
        getMenuItem();
    }, [])

    const handleDeleteClick = () => {
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
        <>
            <div className="container mt-5 p-2 d-flex justify-content-center mt-4">
                {loading ? (
                    <ScreenLoader />
                ) : (

                    <div className="card shadow-sm p-3" style={{ maxWidth: "400px", borderRadius: "10px" }}>
                        {/* Image Section */}
                        <div className="text-center">
                            <img
                                src={menuItem.imageUrl}
                                alt={menuItem.menuName}
                                className="img-fluid rounded"
                                style={{ height: "200px", objectFit: "cover", width: "100%" }}
                            />
                        </div>

                        {/* Item Details */}
                        <div className="card-body">
                            <h5 className="card-title fw-bold">{menuItem.menuName}</h5>
                            <p className="text-muted">{menuItem.description}</p>
                            <p className="fw-bold text-success fs-5">₹{menuItem.price}</p>

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-center gap-2">
                                <button className="btn button" style={{ width: '50%' }} onClick={() => navigate("/update-menuitem", { state: { menuData: menuItem } })}>Update</button>
                                <button className="btn button" style={{ width: '50%' }} onClick={handleDeleteClick}>{MenuItemText}</button>
                                {/* <button className="btn button" style={{ width: '100%' }} type='submit' onClick={updateMenuItemHandler}></button> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal isOpen={isModalOpen} onConfirm={handleConfirm} onCancel={handleCancel} title="Confirm" content="Confirm, you want to delete this menuitem?" />
        </>
    )
}

import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../../Components/ScreenLoader';
import { getMenuOfProvider } from '../../../Services/MenuService';

export const ViewMenuItemProvider = () => {

    const userId = localStorage.getItem("singleUserId");

    const [loading, setLoading] = useState(false);

    const [menuItems, setMenuItems] = useState([]);

    const getMenuitemsOfProvider = () => {
        setLoading(true);

        getMenuOfProvider(userId).then((response) => {
            setLoading(false);
            setMenuItems(response)
            console.log(response)
        }).catch((error) => {
            setLoading(false);
            console.log(error)
        })
    }

    useEffect(()=> {
        getMenuitemsOfProvider();
    }, [])

    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-3 heading">Menu Items Of Provider</h2>
                    {menuItems.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <p className="fs-6">This provider don’t have any menu items.</p>
                        </div>
                    ) : (
                        <div className="row">
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
                                            <h6 className="card-title">{item.menuName}</h6>
                                            <p className="card-text small text-muted truncate-description">{item.description}</p>
                                            <p className="fw-bold text-success mb-1">₹{item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

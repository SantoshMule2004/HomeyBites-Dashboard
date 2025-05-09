import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../../Components/ScreenLoader'
import { fetchMenu } from '../../../Services/MenuService';
import { useMenuItems } from '../../../Context/MenuItemContext';

export const AllMenuItems = () => {

    const [loading, setLoading] = useState(true);

    const [allMenuItemData, setallMenuItemData] = useState([]);

    const { getMenuItemsData, setMenuItemsData } = useMenuItems();

    const getAllMenuItems = () => {
        setLoading(true);
        if(getMenuItemsData() == null) {
            fetchMenu().then((response) => {
                setLoading(false);
                setallMenuItemData(response)
                setMenuItemsData(response);
            }).catch((error) => {
                setLoading(false);
                console.log(error)
            })
        } else {
            setLoading(false);
            setallMenuItemData(getMenuItemsData());
        }
    }

    useEffect(() => {
        getAllMenuItems();
    }, [])

    return (
        <div className='container mt-5 p-2 hide-scrollbar'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-4 heading">Menuitem’s</h2>
                    {allMenuItemData.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <p className="fs-5">don’t have any Menuitems to show.</p>
                        </div>
                    ) : (
                        <div className="row mx-3">
                            {allMenuItemData.map((item) => (
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
                </>)}
        </div>
    )
}

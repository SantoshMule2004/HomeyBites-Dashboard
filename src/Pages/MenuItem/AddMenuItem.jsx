import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import useButtonLoader from '../../Components/UseButtonLoader';
import { toast } from 'react-toastify';
import { addMenu } from '../../Services/MenuService';
import { getUserInfo } from '../../Components/Auth/Index';

export const AddMenuItem = () => {

    const [menuData, setMenuData] = useState({
        menuName: '',
        price: '',
        description: '',
        menuType: '',
        active: true
    })

    const [menuImage, setMenuImage] = useState("");

    const user = getUserInfo();

    const [CategoryId, setCategoryId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [MenuItemText, setMenuItemButtonLoading] = useButtonLoader(
        "Add Menuitem",
        "Add Menuitem"
    )

    // change handler
    const changeHandler = (event, property) => {
        setMenuData({ ...menuData, [property]: event.target.value })
    }

    const categoryHandler = (event) => {
        setCategoryId(event.target.value);
    }

    const imageHandler = (event) => {
        setMenuImage(event.target.files[0]);
    };

    useEffect(() => {
        console.log(menuData);
        console.log(CategoryId);
        console.log(menuImage)
    }, [menuData])

    const AddMenuItemHandler = (event) => {
        event.preventDefault();
        setMenuItemButtonLoading(true);
        setLoading(true);

        if (!menuData.menuName && !menuData.description && !menuData.price && !menuData.menuType && !CategoryId) {
            toast.error("Please fill all the details..");
            setMenuItemButtonLoading(false);
            setLoading(false);
            return;
        }

        if (user != null) {

            const formData = new FormData();

            formData.append("menuItemData", new Blob([JSON.stringify(menuData)], { type: "application/json" }));
            formData.append("file", menuImage);

            addMenu(user.userId, CategoryId, formData).then((response) => {
                setMenuItemButtonLoading(false);
                setLoading(false);
                console.log(response);
                toast.success("Menu item added successfully..");
            }).catch((error) => {
                setMenuItemButtonLoading(false);
                setLoading(false);
                console.log(error);
                toast.error("Error");
            })
        }
    }


    return (
        <div className="container mt-5 p-3" style={{ backgroundColor: '#faf9f6' }}>
            <h2 className="text-3xl mb-5 heading">Add Menu Item</h2>
            <form className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="inputMenuName" className="form-label fw-bold">Menu item name</label>
                    <input type="text" className="form-control no-focus-outline" id="inputMenuName" onChange={(e) => changeHandler(e, 'menuName')} value={menuData.menuName} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputMenuType" className="form-label fw-bold">Menu Type</label>
                    <select id="inputMenuType" className="form-select no-focus-outline" onChange={(e) => changeHandler(e, 'menuType')}>
                        <option value='Thali'>Thali</option>
                        <option value='Breakfast'>Breakfast</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="inputMenuPrice" className="form-label fw-bold">Price</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text">₹</span>
                        <input type="text" className="form-control no-focus-outline" id='inputMenuPrice' aria-label="Amount (to the nearest dollar)" onChange={(e) => changeHandler(e, 'price')} value={menuData.price} />
                        <span className="input-group-text">.00</span>
                    </div>
                </div>

                <div className="col-md-8">
                    <label htmlFor="inputCategory" className="form-label fw-bold">Category: </label>
                    <select id="inputCategory" className="form-select no-focus-outline" onClick={categoryHandler}>
                        <option value='1'>Veg</option>
                        <option value='2'>Non-Veg</option>
                        <option>...</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="inputMenuImage" className="form-label fw-bold">Menu item image</label>
                    <input
                        type="file"
                        className="form-control no-focus-outline"
                        id="inputMenuImage"
                        onChange={imageHandler}
                        accept="image/*"
                    />
                </div>

                <div className="col-md-12">
                    <label htmlFor="inputDesc" className="form-label fw-bold">Description</label>
                    {/* <input type="text" className="form-control" id="inputDesc" /> */}
                    <textarea className="form-control no-focus-outline" rows="3" id='inputDesc' onChange={(e) => changeHandler(e, 'description')} value={menuData.description}></textarea>
                </div>

                <div className="col-12 mt-5 d-flex justify-content-center">
                    {/* <button type="submit" className="btn button">Add Menuitem</button> */}
                    <button className={`btn button`} type='submit' onClick={AddMenuItemHandler}>{MenuItemText}</button>
                </div>
            </form>
        </div>
    )
}

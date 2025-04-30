import { createContext, useContext } from "react";

export const MenuContext = createContext();

export const MenuItemContext = ({ children }) => {

    const getMenuItemsData = () => {
        return JSON.parse(localStorage.getItem("menuItems"));
    }

    const setMenuItemsData = (menuItems) => {
        const menuItemData = JSON.stringify(menuItems);
        localStorage.setItem("menuItems", menuItemData);
    }

    const addMenuItemToData = (menuItem) => {
        let menuData = localStorage.getItem("menuItems");
        let menuArray = menuData ? JSON.parse(menuData) : [];
        menuArray.push(menuItem);
        localStorage.setItem("menuItems", JSON.stringify(menuArray));
    }

    const updateMenuItemData = (menuId, menuItem) => {
        // get data stord in localstorage
        let menuData = localStorage.getItem("menuItems");
        let menuArray = menuData ? JSON.parse(menuData) : [];

        // filter out the previous item
        menuArray = menuArray.filter(item => item.menuId !== Number(menuId));

        // add new updated item to it
        menuArray.push(menuItem);
        localStorage.setItem("menuItems", JSON.stringify(menuArray));
    }

    const deleteMenuItemData = (menuId) => {
        // get data stord in localstorage
        let menuData = localStorage.getItem("menuItems");
        let menuArray = menuData ? JSON.parse(menuData) : [];
        
        // filter out the previous item
        menuArray = menuArray.filter(item => item.menuId !== Number(menuId));
        
        localStorage.setItem("menuItems", JSON.stringify(menuArray));
    }

    return (
        <MenuContext.Provider value={{ getMenuItemsData, setMenuItemsData, addMenuItemToData, updateMenuItemData, deleteMenuItemData }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenuItems = () => {
    const MenuItemContextValue = useContext(MenuContext);
    if (!MenuItemContextValue) {
        throw new Error("useMenuItems called outside provider");
    }
    return MenuItemContextValue;
}

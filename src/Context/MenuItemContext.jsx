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

  return (
    <MenuContext.Provider value={{getMenuItemsData, setMenuItemsData, addMenuItemToData}}>
        {children}
    </MenuContext.Provider>
  );
};

export const useMenuItems = () => {
    const MenuItemContextValue = useContext(MenuContext);
    if(!MenuItemContextValue){
        throw new Error("useMenuItems called outside provider");
    }
    return MenuItemContextValue;
}

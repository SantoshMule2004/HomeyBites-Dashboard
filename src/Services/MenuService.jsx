import { myAxios } from "./Helper";

// api to fetch menu by type
export const fetchMenuByType = (menuType) => {
    return myAxios.get('/api/v1/menuitems/type?menuType='+menuType)
    .then((response) => response.data);
}

// api to fetch all menu items
export const fetchMenu = () => {
    return myAxios.get('/api/v1/menuitems')
    .then((response) => response.data);
}

// api to fetch single menu 
export const getMenu = (id) => {
    return myAxios.get('/api/v1/menuitem/'+id)
    .then((response) => response.data);
}

// api to fetch menu items of a tiffin provider
export const getMenuOfProvider = (userId) => {
    return myAxios.get(`api/v1/tiffin-provider/${userId}/menuitems`)
    .then((response) => response.data);
}

// api to add menu item
export const addMenu = (userId, cId, menuData) => {
    return myAxios.post(`api/v1/user/${userId}/category/${cId}/menuitem/`, menuData)
    .then((response) => response.data);
}

// api to upload menu image
export const uploadMenuImage = (menuId) => {
    return myAxios.post(`api/vi/menuitem/upload/${menuId}`)
    .then((response) => response.data);
}

// api to update menu item info
export const updateMenu = (menuId, menuData) => {
    return myAxios.put(`api/v1/menuitem/${menuId}`, menuData)
    .then((response) => response.data);
}

// api to delete menu item
export const deleteMenu = (menuId) => {
    return myAxios.delete(`api/v1/menuitem/${menuId}`)
    .then((response) => response.data);
}
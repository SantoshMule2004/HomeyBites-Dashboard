import { PublicApiClient, PrivateApiClient } from "./apiHelper";

// // Add new holiday
// export const addProviderHoliday = async (data) => {
//     const response = await PrivateApiClient.post(`/api/v1/provider/holidays`, data)
//     return response.data
// }

// Update holiday
export const updateProviderMenuitems = async (menuId, data) => {
    const response = await PrivateApiClient.put(`/api/v1/provider/menu`, { providerMenuId: menuId, meals: data })
    return response.data
}

// toggle menu status
export const toggleProviderMenuStatus = async (menuId, isActive) => {
    const response = await PrivateApiClient.put(`/api/v1/provider/menu/status/${menuId}?isActive=${isActive}`)
    return response.data
}

// get all Menus
export const getAllMenus = async () => {
    const response = await PrivateApiClient.get(`/api/v1/provider/menu`)
    return response.data
}

// delete a holiday
export const deleteProviderMenu = async (menuId) => {
    const response = await PrivateApiClient.delete(`/api/v1/provider/menu/${menuId}`)
    return response.data
}
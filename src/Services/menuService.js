import { PublicApiClient, PrivateApiClient } from "./apiHelper";

// add category
export const addCategory = async (data) => {
    const response = await PrivateApiClient.post(`/api/v1/category`, data)
    return response.data
}

// update category 
export const updateCategory = async (categoryId, data) => {
    const response = await PrivateApiClient.put(`/api/v1/category/${categoryId}`, data)
    return response.data
}

// delete category 
export const deleteCategory = async (categoryId) => {
    const response = await PrivateApiClient.delete(`/api/v1/category/${categoryId}`)
    return response.data
}

// get all categories
export const getAllCategories = async () => {
    const response = await PublicApiClient.get(`/api/v1/category/public`)
    return response.data
}

// get category by Id
export const getCategoryById = async (cId) => {
    const response = await PublicApiClient.get(`/api/v1/category/public/${cId}`)
    return response.data
}

// add menuitem with image
export const addMenuItemWithImage = async (providerId, cId, data) => {
    const response = await PrivateApiClient.post(`/api/v1/menuitem-image/tiffin-provider/${providerId}/category/${cId}`, data, {
        headers: {
            "Content-Type": undefined,
        }
    })
    return response.data
}

// add menuitem
export const addMenuItem = async (providerId, cId, data) => {
    const response = await PrivateApiClient.post(`/api/v1/menuitem/tiffin-provider/${providerId}/category/${cId}`, data)
    return response.data
}

// upload menuitem image
export const uploadMenuItemImage = async (menuId, file) => {
    const response = await PrivateApiClient.post(`/api/v1/menuitem/upload/${menuId}`, file, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

// update menuitem
export const updateMenuItem = async (menuId, data) => {
    const response = await PrivateApiClient.put(`/api/v1/menuitem/${menuId}`, data)
    return response.data
}

// get menuitems of a provider
export const getMenuItemsOfProvider = async (providerId, menuType = null, search = null, categoryId = null, isActive = null, page = 0, size = 5) => {
    console.log("Search:", search)
    const params = {
        menuType: menuType || undefined,
        search: search || undefined,
        categoryId: categoryId || undefined,
        isActive: isActive,
        size: size,
        page: page
    }
    const response = await PrivateApiClient.get(`/api/v1/tiffin-provider/${providerId}/menuitems`, { params: params })
    return response.data
}

// activate-disable menuitem
export const toggleMenuItem = async (menuId, isActive) => {
    const response = await PrivateApiClient.put(`/api/v1/menuitem/toggle/${menuId}?isActive=${isActive}`)
    return response.data
}

// delete menuitem
export const deleteMenuItem = async (menuId) => {
    const response = await PrivateApiClient.delete(`/api/v1/menuitem/delete/${menuId}`)
    return response.data
}
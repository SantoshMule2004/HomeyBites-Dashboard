import { PublicApiClient, PrivateApiClient } from "./apiHelper";

// Add new holiday
export const addProviderHoliday = async (data) => {
    const response = await PrivateApiClient.post(`/api/v1/provider/holidays`, data)
    return response.data
}

// Update holiday
export const updateProviderHoliday = async (holidayId, data) => {
    const response = await PrivateApiClient.put(`/api/v1/provider/holidays/${holidayId}`, data)
    return response.data
}

// toggle holiday status
export const toggleProviderHolidayStatus = async (holidayId, isActive) => {
    const response = await PrivateApiClient.put(`/api/v1/provider/holidays/status/${holidayId}?isActive=${isActive}`)
    return response.data
}

// get upcoming holidays
export const getUpcomingHolidays = async () => {
    const response = await PrivateApiClient.get(`/api/v1/provider/holidays`)
    return response.data
}

// get all holidays
export const getAllHolidays = async (filters = {}) => {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.size) params.size = filters.size;

    const response = await PrivateApiClient.get(`/api/v1/provider/holidays/all`, { params })
    return response.data
}

// get all holidays for admin
export const getAllHolidaysForAdmin = async (providerId, params) => {
    const response = await PrivateApiClient.get(`/api/v1/provider/holidays/all/${providerId}`)
    return response.data
}

// delete a holiday
export const deleteProviderHoliday = async (holidayId) => {
    const response = await PrivateApiClient.delete(`/api/v1/provider/holidays/${holidayId}`)
    return response.data
}
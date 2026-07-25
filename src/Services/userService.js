import { PrivateApiClient, PublicApiClient } from "./apiHelper";

// get all users - role, search
export const getAllUsers = async (filters = {}) => {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.size) params.size = filters.size;
    if (filters.userRole) params.userRole = filters.userRole;
    if (filters.search) params.search = filters.search;

    return await PrivateApiClient.get(`/api/v1/users/`, { params })
        .then((response) => response.data)
}

// get user by id
export const getUserById = async (userId) => {
    return await PrivateApiClient.get(`/api/v1/users/${userId}`)
        .then((response) => response.data)
}

// update user details
export const updateUserDetails = async (userId, data) => {
    return await PrivateApiClient.put(`/api/v1/users/${userId}/user-details`, data)
        .then((response) => response.data)
}

// get business details
export const getUserDetails = async (providerId) => {
    return await PrivateApiClient.get(`/api/v1/users/user-details?providerId=${providerId}`)
        .then((response) => response.data)
}

// update business details
export const updateBusinessDetails = async (providerId, data) => {
    return await PrivateApiClient.put(`/api/v1/users/business-details/${providerId}`, data)
        .then((response) => response.data)
}
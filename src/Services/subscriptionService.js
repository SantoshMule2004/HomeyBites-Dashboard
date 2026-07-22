import { PublicApiClient, PrivateApiClient } from "./apiHelper";

// get user subscriptions for tiffin provider
export const getUserSubscriptions = (providerId, filters = {}, page = 0, size = 5) => {
    const params = { page, size };
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;

    return PrivateApiClient
        .get(`/api/v1/subscription/tiffin-provider/${providerId}`, { params })
        .then((res) => res.data);
};

// get user subscriptions for Admin
export const getAdminSubscriptions = (filters = {}) => {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.size) params.size = filters.size;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;

    return PrivateApiClient.get(`/api/v1/subscription/admin`, { params })
        .then((res) => res.data);
};
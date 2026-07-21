import { PublicApiClient, PrivateApiClient } from "./apiHelper";

export const getTodaysDeliveries = async (filters = {}, page = 0, size = 5) => {
    const params = { page, size }

    if (filters.mealType) params.mealType = filters.mealType;
    if (filters.search) params.search = filters.search;

    const response = await PrivateApiClient.get(`/api/v1/daily-delivery`, { params });
    return response.data;
};

export const updateDeliveryStatus = async (deliveryId, status) => {
    const response = await PrivateApiClient.put(`/api/v1/daily-delivery/${deliveryId}/status?status=${status}`);
    return response.data;
};
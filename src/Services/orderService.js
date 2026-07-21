import { PublicApiClient, PrivateApiClient } from "./apiHelper";

// get all provider orders
export const getProviderOrders = async (providerId, filters = {}, page = 0, size = 8) => {
    const params = { page, size };
    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.receiverName) params.receiverName = filters.receiverName;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return await PrivateApiClient.get(`/api/v1/orders/provider/${providerId}/all`, { params })
        .then((response) => response.data);
}

// get provider order details
export const getProviderOrder = async (providerId, providerOrderId) => {
    return await PrivateApiClient.get(`/api/v1/orders/provider/${providerId}/provider-order/${providerOrderId}`)
        .then((response) => response.data);
}

// update order status
export const updateOrderStatus = async (providerId, providerOrderId, status) => {
    return await PrivateApiClient.put(`/api/v1/orders/provider/${providerId}/status/${providerOrderId}?status=${status}`)
        .then((response) => response.data);
}


// get all orders
export const getOrders = async (filters = {}, page = 0, size = 8) => {
    const params = { page, size };
    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.receiverName) params.receiverName = filters.receiverName;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return await PrivateApiClient.get(`/api/v1/orders/admin/all`, { params })
        .then((response) => response.data);
}

// get order details
export const getOrder = async (providerOrderId) => {
    return await PrivateApiClient.get(`/api/v1/orders/admin/order/${providerOrderId}`)
        .then((response) => response.data);
}
import { PublicApiClient, PrivateApiClient } from "./apiHelper";

// get all provider payments
export const getProviderPayments = async (filters = {}, page = 0, size = 8) => {
    const params = { page, size };
    if (filters.search) params.search = filters.search;
    if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return await PrivateApiClient.get(`/api/v1/provider/payments`, { params })
        .then((response) => response.data);
}

// get provider payment details
export const getProviderPaymentDetails = async (paymentId) => {
    return await PrivateApiClient.get(`/api/v1/provider/payments/${paymentId}`)
        .then((response) => response.data);
}

// update payment status - provider
export const updatePaymentStatus = async (paymentId, data) => {
    console.log("data:", data)
    return await PrivateApiClient.put(`/api/v1/provider/payments/${paymentId}`, data)
        .then((response) => response.data);
}


// get all payments
export const getAdminPayments = async (filters = {}) => {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.size) params.size = filters.size;
    if (filters.search) params.search = filters.search;
    if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return await PrivateApiClient.get(`/api/v1/admin/payments`, { params })
        .then((response) => response.data);
}

// get payment details
export const getPaymentDetails = async (paymentId) => {
    return await PrivateApiClient.get(`/api/v1/admin/payments/${paymentId}`)
        .then((response) => response.data);
}
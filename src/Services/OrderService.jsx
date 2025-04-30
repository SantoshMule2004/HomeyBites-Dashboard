import { myAxios } from "./Helper";

export const getTodaysOrders = async (userId) => {
    return await myAxios.get(`/api/v1/orders/today/${userId}`)
        .then((response) => response.data);
}

export const getAllTodaysOrders = async () => {
    return await myAxios.get(`/api/v1/orders/today/all`)
        .then((response) => response.data);
}

export const getAllOrders = async () => {
    return await myAxios.get(`/api/v1/orders/all`)
        .then((response) => response.data);
}

export const getOrdersByStatus = async (status) => {
    return await myAxios.get(`/api/v1/orders/?status=${status}`)
        .then((response) => response.data);
}

export const updateOrderStatus = async (orderId, status) => {
    return await myAxios.put(`/api/v1/orders/update/${orderId}?status=${status}`)
        .then((response) => response.data);
}

export const getAllOrdersOfProvider = async (userId, status) => {
    return await myAxios.get(`/api/v1/orders/menuitem/${userId}?status=${status}`)
        .then((response) => response.data);
}

export const getTiffinProviderOrdersInaRange = async (userId, stratDate, endDate) => {
    return await myAxios.get(`/api/v1/orders/provider/${userId}?startDate=${stratDate}&endDate=${endDate}`)
        .then((response) => response.data);
}

export const getOrdersInaRange = async (stratDate, endDate) => {
    return await myAxios.get(`/api/v1/orders/range?startDate=${stratDate}&endDate=${endDate}`)
        .then((response) => response.data);
}

export const getOrderCount = async (providerId) => {
    return await myAxios.get(`/api/v1/orders/count/${providerId}`)
        .then((response) => response.data);
}

export const getAllOrderCount = async () => {
    return await myAxios.get(`/api/v1/orders/count`)
        .then((response) => response.data);
}
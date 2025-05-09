import { myAxios } from "./Helper";

export const getTotalRevenue = async () => {
    return await myAxios.get(`/api/v1/payment/revenue`)
        .then((response) => response.data);
}

export const getMenuItemRevenue = async () => {
    return await myAxios.get(`/api/v1/payment/revenue/menuitem`)
        .then((response) => response.data);
}

export const getSUbRevenue = async () => {
    return await myAxios.get(`/api/v1/payment/revenue/subscription`)
        .then((response) => response.data);
}

export const getTotalRevenueOfProvider = async (providerId) => {
    return await myAxios.get(`/api/v1/payment/revenue/provider/${providerId}`)
        .then((response) => response.data);
}

export const getTotalMenuItemRevenue = async (providerId) => {
    return await myAxios.get(`/api/v1/payment/revenue/menuitem/${providerId}`)
        .then((response) => response.data);
}

export const getTotalSUbRevenue = async (providerId) => {
    return await myAxios.get(`/api/v1/payment/revenue/subscription/${providerId}`)
        .then((response) => response.data);
}

export const getPastPaymentData = async (providerId, date) => {
    return await myAxios.get(`/api/v1/payment/history/provider/${providerId}?date=${date}`)
        .then((response) => response.data);
}

export const getPastPayment = async (date) => {
    return await myAxios.get(`/api/v1/payment/history?date=${date}`)
        .then((response) => response.data);
}

export const getAllPaymentData = async () => {
    return await myAxios.get(`/api/v1/payment/all`)
        .then((response) => response.data);
}

export const getAllPaymentDataOfProvider = async (providerId) => {
    return await myAxios.get(`/api/v1/payment/provider/${providerId}`)
        .then((response) => response.data);
}
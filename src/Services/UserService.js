import { use } from "react";
import { myAxios } from "./Helper";

export const logIn = async (user) => {
    return await myAxios.post('/api/v1/auth/tiffin-provider/login', user)
        .then((response) => response.data);
}

export const adminLogIn = async (user) => {
    return await myAxios.post('/api/v1/auth/admin/login', user)
        .then((response) => response.data);
}

export const signIn = async (user) => {
    return await myAxios.post('/api/v1/auth/tiffin-provider/register', user)
        .then((response) => response.data)
}

export const getProviderInfo = async (userId) => {
    return await myAxios.get(`/api/v1/users/${userId}`).then((response) => response.data)
}

export const updateUserInfo = async (userId, userData) => {
    return await myAxios.put('/api/v1/users/' + userId, userData)
        .then((response) => response.data)
}

export const updateBusinessDetails = async (userId, userData, addressId) => {
    return await myAxios.put('/api/v1/users/business-details/' + userId + '/' + addressId, userData)
        .then((response) => response.data)
}

export const updateContactDetails = async (userId, number) => {
    return await myAxios.put(`/api/v1/users/contact-details/${userId}?number=${number}`)
        .then((response) => response.data)
}

export const addBusinessDetails = async (userId, user) => {
    return await myAxios.put('/api/v1/auth/tiffin-provider/' + userId + '/business-details', user)
        .then((response) => response.data)
}

export const VerifyEmail = async (otp, username) => {
    return await myAxios.post('/api/v1/auth/verify-email?otp=' + otp + '&username=' + username)
        .then((response) => response.data)
}

export const VerifyOtp = async (otp, username) => {
    return await myAxios.post('/api/v1/auth/verify-otp?otp=' + otp + '&username=' + username)
        .then((response) => response.data)
}

export const sendOtp = async (username) => {
    return await myAxios.post('/api/v1/auth/resend-otp?username=' + username)
        .then((response) => response.data)
}

export const sendOtpForUpdate = async (username) => {
    return await myAxios.post('/api/v1/auth/update/resend-otp?username=' + username)
        .then((response) => response.data)
}

export const forgetpassword = async (username) => {
    return await myAxios.post('/api/v1/auth/forget-password?username=' + username)
        .then((response) => response.data)
}

export const resetPass = async (data, username) => {
    // console.log(data);
    return await myAxios.post('/api/v1/auth/reset-pass?emailId=' + username, data)
        .then((response) => response.data)
}

export const resetPassword = async (data) => {
    // console.log(data);
    return await myAxios.post('/api/v1/users/reset-password', data)
        .then((response) => response.data)
}

export const getAllUserByRole = async (role) => {
    return await myAxios.get(`/api/v1/users/role?role=${role}`).then((response) => response.data)
}

export const getAllUserCount = async () => {
    return await myAxios.get(`/api/v1/users/all/count`).then((response) => response.data)
}

export const getAllUserCountByRole = async (role) => {
    return await myAxios.get(`/api/v1/users/count?role=${role}`).then((response) => response.data)
}
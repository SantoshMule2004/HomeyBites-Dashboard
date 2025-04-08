import { use } from "react";
import { myAxios } from "./Helper"; 

export const logIn = async (user) => {
    return await myAxios.post('/api/v1/auth/tiffin-provider/login', user)
    .then((response) => response.data);
}

export const signIn = async (user) => {
    return await myAxios.post('/api/v1/auth/tiffin-provider/register', user)
    .then((response) => response.data)
}

export const updateUserInfo = async (userId, userData) => {
    return await myAxios.put('/api/v1/users/'+userId, userData)
    .then((response) => response.data)
}

export const updateBusinessDetails = async (userId, userData, addressId) => {
    return await myAxios.put('/api/v1/users/business-details/'+userId+'/'+addressId, userData)
    .then((response) => response.data)
}

export const addBusinessDetails = async (userId, user) => {
    return await myAxios.put('/api/v1/auth/tiffin-provider/'+userId+'/business-details', user)
    .then((response) => response.data)
}

export const VerifyEmail = async (otp, username) => {
    return await myAxios.post('/api/v1/auth/verify-email?otp='+otp+'&username='+username)
    .then((response) => response.data)
}

export const VerifyOtp = async (otp, username) => {
    return await myAxios.post('/api/v1/auth/verify-otp?otp='+otp+'&username='+username)
    .then((response) => response.data)
}

export const sendOtp = async (username) => {
    return await myAxios.post('/api/v1/auth/resend-otp?username='+username)
    .then((response) => response.data)
} 

export const forgetpassword = async (username) => {
    return await myAxios.post('/api/v1/auth/forget-password?username='+username)  
    .then((response) => response.data)
}

export const resetPass = async (data, username) => {
    console.log(data);
    return await myAxios.post('/api/v1/auth/reset-pass?emailId='+username, data)  
    .then((response) => response.data)
}

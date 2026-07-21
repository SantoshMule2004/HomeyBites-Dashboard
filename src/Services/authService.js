import { PublicApiClient, PrivateApiClient } from "./apiHelper"

// admin login
export const adminLogin = async (data) => {
    console.log("Data - ", data)
    const response = await PublicApiClient.post("/api/v1/auth/admin/login", data)
    return response.data
}

// provider login
export const providerLogin = async (data) => {
    console.log("Data - ", data)
    const response = await PublicApiClient.post("/api/v1/auth/tiffin-provider/login", data)
    return response.data
}

// register provider
export const providerRegister = async (data) => {
    console.log("Data - ", data)
    const response = await PublicApiClient.post("/api/v1/auth/tiffin-provider/register", data)
    return response.data
}

// add business details
export const addBussinessDetails = async (providerId, data) => {
    console.log("Data - ", data)
    const response = await PublicApiClient.post(`/api/v1/auth/tiffin-provider/${providerId}/business-details`, data)
    return response.data
}

// send-otp at register
export const sendOtp = async (emailId) => {
    const response = await PublicApiClient.post(`/api/v1/auth/send-otp?username=${emailId}`)
    return response.data
}

// verify-otp register
export const verifyOtp = async (data) => {
    const response = await PublicApiClient.post(`/api/v1/auth/verify-otp?otp=${data.otp}&username=${data.emailId}`)
    return response.data
}

// send-otp when logged in
export const sendOtptoVerifyEmail = async (username) => {
    return await PublicApiClient.post('/api/v1/auth/update/send-otp?username=' + username)
        .then((response) => response.data)
}

// Reset password data = { newPassword, cPassword }
export const resetPassword = async (data, username) => {
    return await PublicApiClient.post(`/api/v1/auth/reset-pass?emailId=${username}`, data)
        .then((response) => response.data)
}

// change password data = { oldPassword, newPassword, cPassword }
export const changePassword = async (data) => {
    return await PrivateApiClient.post(`/api/v1/users/reset-password`, data)
        .then((response) => response.data)
}
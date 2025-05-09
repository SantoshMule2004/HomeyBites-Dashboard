import React, { createContext, useContext } from 'react'

export const UserInfoContext = createContext();

export const UserContext = ({ children }) => {

    const isLoggedIn = () => {
        let data = localStorage.getItem("authToken");
        if (data != null) return true;
        else return false;
    };

    const doLogin = (data, next) => {
        localStorage.setItem("authToken", data.token);
        const userData = JSON.stringify(data.user);
        localStorage.setItem("user", userData);
        next()
    };

    const doLogout = (next) => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("planId");
        localStorage.removeItem("subId");
        localStorage.removeItem("tiffinData");
        localStorage.removeItem("menuData");
        localStorage.removeItem("providerId");
        localStorage.removeItem("menuItems");
        localStorage.removeItem("tiffinPlans");
        localStorage.removeItem("Subscriptions");
        localStorage.removeItem("AdminLogin");
        localStorage.removeItem("Allorders");
        localStorage.removeItem("EmailsData");
        localStorage.removeItem("AllTodaysOrders");
        localStorage.removeItem("TodaysEmailsData");
        localStorage.removeItem("DashboardOrders");
        localStorage.removeItem("RevenueData");
        localStorage.removeItem("PaymentData");
        localStorage.removeItem("PaymentEmailsData");
        localStorage.removeItem("SystemUser");
        localStorage.removeItem("SystemProvider");
        next()
    }

    const getAuthToken = () => {
        return localStorage.getItem("authToken");
    }

    const getUserInfo = () => {
        if (isLoggedIn())
            return JSON.parse(localStorage.getItem("user"));
    }

    const setUserInfo = (user) => {
        const userData = JSON.stringify(user);
        localStorage.setItem("user", userData);
    }

    const getSystemUserInfo = () => {
        if (isLoggedIn())
            return JSON.parse(localStorage.getItem("SystemUser"));
    }

    const setSystemUserInfo = (user) => {
        const userData = JSON.stringify(user);
        localStorage.setItem("SystemUser", userData);
    }

    const getSystemProviderInfo = () => {
        if (isLoggedIn())
            return JSON.parse(localStorage.getItem("SystemProvider"));
    }

    const setSystemProviderInfo = (user) => {
        const userData = JSON.stringify(user);
        localStorage.setItem("SystemProvider", userData);
    }

    return (
        <UserInfoContext.Provider value={{ isLoggedIn, doLogin, doLogout, getAuthToken, getUserInfo, setUserInfo, getSystemProviderInfo, getSystemUserInfo, setSystemProviderInfo, setSystemUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    )
};

export const useUserInfo = () => {
    const UserContextValue = useContext(UserInfoContext);
    if (!UserContextValue) {
        throw new Error("useUserInfo called outside provider");
    }
    return UserContextValue;
}
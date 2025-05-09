import React, { createContext, useContext } from 'react'

export const OContext = createContext();

export const OrderContext = ({ children }) => {

    // functions to store todays order data
    const getTodaysOrdersInfo = () => {
        return JSON.parse(localStorage.getItem("AllTodaysOrders"));
    }
    
    const setTodaysOrdersInfo = (orders) => {
        const orderData = JSON.stringify(orders);
        localStorage.setItem("AllTodaysOrders", orderData);
    }

     // functions to store todays order data related email ids 
     const getTodaysEmailIds = () => {
        return JSON.parse(localStorage.getItem("TodaysEmailsData"));
    }

    const setTodaysEmails = (emails) => {
        const emailData = JSON.stringify(emails);
        localStorage.setItem("TodaysEmailsData", emailData);
    }

    
    // functions to store dashboard order data
    const getDashboardOrders = () => {
        return JSON.parse(localStorage.getItem("DashboardOrders"));
    }
    
    const setDashboardOrders = (orders) => {
        const orderData = JSON.stringify(orders);
        localStorage.setItem("DashboardOrders", orderData);
    }

    
    // functions to store all order data
    const getOrdersInfo = () => {
        return JSON.parse(localStorage.getItem("Allorders"));
    }
    
    const setOrdersInfo = (orders) => {
        const orderData = JSON.stringify(orders);
        localStorage.setItem("Allorders", orderData);
    }
    
    // functions to store all order data related email ids 
    const getEmailIds = () => {
        return JSON.parse(localStorage.getItem("EmailsData"));
    }
    
    const setEmails = (emails) => {
        const emailData = JSON.stringify(emails);
        localStorage.setItem("EmailsData", emailData);
    }

    // function to store revenue data
    const getRevenueOfOrders = () => {
        return JSON.parse(localStorage.getItem("RevenueData"));
    }
    
    const setRevenueOfOrders = (orders) => {
        const orderData = JSON.stringify(orders);
        localStorage.setItem("RevenueData", orderData);
    }

    // function to store payment data
    const getPaymentForOrders = () => {
        return JSON.parse(localStorage.getItem("PaymentData"));
    }
    
    const setPaymentForOrders = (orders) => {
        const orderData = JSON.stringify(orders);
        localStorage.setItem("PaymentData", orderData);
    }
    
    // functions to store paymenta related email ids 
    const getPaymentEmailIds = () => {
        return JSON.parse(localStorage.getItem("PaymentEmailsData"));
    }
    
    const setPaymentEmails = (emails) => {
        const emailData = JSON.stringify(emails);
        localStorage.setItem("PaymentEmailsData", emailData);
    }

    return (
        <OContext.Provider value={{ getOrdersInfo, setOrdersInfo, getEmailIds, setEmails, getTodaysOrdersInfo, setTodaysOrdersInfo, getTodaysEmailIds, setTodaysEmails, getDashboardOrders, setDashboardOrders, getRevenueOfOrders, setRevenueOfOrders, getPaymentForOrders, setPaymentForOrders, getPaymentEmailIds,setPaymentEmails }}>
            {children}
        </OContext.Provider>
    )
};

export const useOrderData = () => {
    const OrderContextValue = useContext(OContext);
    if (!OrderContextValue) {
        throw new Error("useOrderData called outside provider");
    }
    return OrderContextValue;
}
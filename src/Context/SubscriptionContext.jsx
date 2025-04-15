import React, { createContext, useContext } from 'react'

const SubContext = createContext();

export const SubscriptionContext = ({ children }) => {

    const getSubscriptionData = () => {
        return JSON.parse(localStorage.getItem("Subscriptions"));
    }

    const setSubscriptionData = (subscriptions) => {
        const subscriptionData = JSON.stringify(subscriptions);
        localStorage.setItem("Subscriptions", subscriptionData);
    }

    return (
        <SubContext.Provider value={{getSubscriptionData, setSubscriptionData}}>
            {children}
        </SubContext.Provider>
    );
};

export const useSubscriptions = () => {
    const SubContextValue = useContext(SubContext);
    if (!SubContextValue) {
        throw new Error("useSubscriptions called outside provider");
    }
    return SubContextValue;
}
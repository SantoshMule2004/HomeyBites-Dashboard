import React, { createContext } from 'react'
import { useContext } from 'react'

export const TiffinContext = createContext();

export const TiffinPlanContext = ({ children }) => {

    const getTiffinPlanData = () => {
        return JSON.parse(localStorage.getItem("tiffinPlans"));
    }

    const setTiffinPlanData = (tiffinPlans) => {
        const tiffinPlanData = JSON.stringify(tiffinPlans);
        localStorage.setItem("tiffinPlans", tiffinPlanData);
    }

    const addTiffinPlanData = (tiffinPlan) => {
        // get data stord in localstorage
        let tiffinData = localStorage.getItem("tiffinPlans");

        let tiffinArray = tiffinData ? JSON.parse(tiffinData) : [];
        // add new item to it
        tiffinArray.push(tiffinPlan);
        // set that in localstorge
        localStorage.setItem("tiffinPlans", JSON.stringify(tiffinArray));
    }

    const updateTiffinPlanData = (planId, tiffinPlan) => {
        // get data stord in localstorage
        let tiffinData = localStorage.getItem("tiffinPlans");
        let tiffinArray = tiffinData ? JSON.parse(tiffinData) : [];

        // filter out the previous item
        tiffinArray = tiffinArray.filter(item => item.tiffinPlanId !== planId);

        // add new updated item to it
        tiffinArray.push(tiffinPlan);
        localStorage.setItem("tiffinPlans", JSON.stringify(tiffinArray));
    }

    const getSingleTiffinPlan = (planId) => {
        // get data stord in localstorage
        let tiffinData = localStorage.getItem("tiffinPlans");
        let tiffinArray = tiffinData ? JSON.parse(tiffinData) : [];

        const planItem =  tiffinArray.find(item => item.tiffinPlanId === planId); 
        console.log("context plan: ", planItem);
        return planItem;
    }

    return (
        <TiffinContext.Provider value={{ getTiffinPlanData, setTiffinPlanData, addTiffinPlanData, updateTiffinPlanData, getSingleTiffinPlan }}>
            {children}
        </TiffinContext.Provider>
    );
};

export const useTiffinPlans = () => {
    const TiffinContextValue = useContext(TiffinContext);
    if (!TiffinContextValue) {
        throw new Error("useTiffinPlans called outside provider");
    }
    return TiffinContextValue;
}
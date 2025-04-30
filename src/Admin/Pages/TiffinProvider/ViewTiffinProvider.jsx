import React, { useEffect, useState } from 'react'
import { getProviderInfo } from '../../../Services/UserService';
import ScreenLoader from '../../../Components/ScreenLoader';
import { ViewUserInfo } from '../../../Components/ViewUserInfo';

export const ViewTiffinProvider = () => {

    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem("singleUserId");

    const [userData, setUserData] = useState({});

    const getSingleUserData = () => {
        setLoading(true);
        if (userId != null) {
            getProviderInfo(userId).then((response) => {
                setLoading(false);
                console.log(response);
                setUserData(response.classObj);
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
    }

    useEffect(()=>{
        getSingleUserData();
    }, [])

    useEffect(()=>{
        console.log(userData);
    }, [userData])

    return (
        <div className='container mt-5 p-2'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <ViewUserInfo userData={userData} />
                </>
            )}
        </div>
    )
}

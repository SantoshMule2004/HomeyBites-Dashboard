import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../../Components/ScreenLoader'
import { UserInfoTable } from '../../../Components/UserInfoTable'
import { getAllUserByRole } from '../../../Services/UserService';

export const TiffinProviders = () => {

    const [loading, setLoading] = useState(true);

    const [tiffinProviders, settiffinProviders] = useState([]);

    const getAllUsers = () => {
        setLoading(true);
        getAllUserByRole("ROLE_TIFFIN_PROVIDER").then((response) => {
            setLoading(false);
            console.log(response)
            settiffinProviders(response)
        }).catch((error) => {
            setLoading(false);
            console.log(error)
        })
    }

    useEffect(() => {
        getAllUsers();
    }, [])
    return (
        <div className='container mt-5 p-2'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-4 heading">Tiffin Provider’s</h2>
                    <UserInfoTable Users={tiffinProviders} navigateTo={"/tiffin-provider"} />
                </>)}
        </div>
    )
}

import React, { useState } from 'react'
import { getUserInfo } from '../../Components/Auth/Index';
import { useNavigate } from 'react-router-dom';
import ScreenLoader from '../../Components/ScreenLoader';

export const UserProfile = () => {
    const [loading, setLoading] = useState(true);

    const user = getUserInfo();

    const navigate = useNavigate();
    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-3 heading">Profile</h2>
                </>
            )}
        </div>
    )
}

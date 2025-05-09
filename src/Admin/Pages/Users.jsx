import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../Components/ScreenLoader'
import { getAllUserByRole } from '../../Services/UserService';
import { Link, useNavigate } from 'react-router-dom';
import { UserInfoTable } from '../../Components/UserInfoTable';
import { useUserInfo } from '../../Context/UserContext';

export const Users = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [allUsers, setAllUsers] = useState([]);

    const { getSystemUserInfo, setSystemUserInfo } = useUserInfo();

    const getAllUsers = () => {
        setLoading(true);
        if (getSystemUserInfo() == null) {
            getAllUserByRole("ROLE_NORMAL_USER").then((response) => {
                setLoading(false);
                setAllUsers(response);
                setSystemUserInfo(response);
            }).catch((error) => {
                setLoading(false);
                console.log(error)
            })
        } else {
            setLoading(false);
            setAllUsers(getSystemUserInfo());
        }
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
                    <h2 className="text-3xl mb-4 heading">User’s</h2>
                    <UserInfoTable Users={allUsers} navigateTo={"/user"} />
                </>)}
        </div>
    )
}

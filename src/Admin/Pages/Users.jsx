import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../Components/ScreenLoader'
import { getAllUserByRole } from '../../Services/UserService';
import { Link, useNavigate } from 'react-router-dom';
import { UserInfoTable } from '../../Components/UserInfoTable';

export const Users = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [allUsers, setAllUsers] = useState([]);


    const getAllUsers = () => {
        setLoading(true);
        getAllUserByRole("ROLE_NORMAL_USER").then((response) =>{
            setLoading(false);
            console.log(response)
            setAllUsers(response)
        }).catch((error) => {
            setLoading(false);
            console.log(error)
        })
    }

    useEffect(()=>{
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

import React, { useState } from 'react'
import { doLogout, getUserInfo, isLoggedIn } from '../../Components/Auth/Index';
import { Link, useNavigate } from 'react-router-dom';
import ScreenLoader from '../../Components/ScreenLoader';

export const UserProfile = () => {
    const [loading, setLoading] = useState(false);

    const user = getUserInfo();

    const logOut = () => {
        doLogout(() => {
            setLogin(false);
            navigate('/');
        });
    };

    const navigate = useNavigate();
    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-3 heading">{"Hey! " + user.firstName + " " + user.lastName}</h2>
                    <div className="row mt-3">
                        <div className="col-md-4 mb-1">
                            <div className="card p-3 shadow profile-div" onClick={()=> navigate("/update-business-details")}>
                                <div className='p-2 pe-3 d-flex justify-content-center align-items-center' style={{ height: '100px' }}>
                                    <i className="fa-solid fa-briefcase fa-lg"></i>
                                </div>
                                <div className='d-flex flex-column justify-content-center'>
                                    <h5>Business Details</h5>
                                    <p>Edit business name, business addresses</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-1">
                            <div className="card p-3 shadow profile-div" onClick={()=> navigate("/update-profile")}>
                                <div className='p-2 pe-3 d-flex justify-content-center align-items-center' style={{ height: '100px' }}>
                                    <i className="fa-solid fa-circle-user fa-lg"></i>
                                </div>
                                <div className='d-flex flex-column justify-content-center'>
                                    <h5> User Details</h5>
                                    <p>Edit personal details</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-1" >
                            <div className="card p-3 shadow profile-div" onClick={()=> navigate("/login-security")}>
                                <div className='p-2 pe-3 d-flex justify-content-center align-items-center' style={{ height: '100px' }}>
                                    <i className="fa-duotone fa-solid fa-lock fa-lg"></i>
                                </div>
                                <div className='d-flex flex-column justify-content-center'>
                                    <h5>Login & security</h5>
                                    <p>Edit login, and mobile number</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-12 d-flex justify-content-center">
                            <Link to='/' className='btn btn-danger' onClick={logOut}>Logout</Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
